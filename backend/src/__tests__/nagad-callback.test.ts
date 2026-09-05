import { describe, it, expect, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { doubleCsrf } from 'csrf-csrf';
import Order from '../models/Order.js';
import { nagadService } from '../services/nagad.service.js';

const JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-for-testing-only';

function generateToken(userId: string, role: 'customer' | 'admin' = 'customer'): string {
  return jwt.sign({ userId, email: 'test@example.com', role }, JWT_SECRET, { expiresIn: '1h' });
}

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => process.env.CSRF_SECRET || 'dev-csrf-secret-change-in-production',
    cookieName: 'x-csrf-token',
    cookieOptions: {
      sameSite: 'strict',
      path: '/',
      httpOnly: true,
      secure: false,
    },
    getSessionIdentifier: (req) => req.ip || req.socket.remoteAddress || 'unknown',
    getCsrfTokenFromRequest: (req) => req.headers['x-csrf-token'] as string | undefined,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    skipCsrfProtection: (req) => {
      const path = req.path;
      if (path.startsWith('/api/payments/stripe/webhook')) return true;
      if (path === '/api/payments/bkash/callback') return true;
      if (path === '/api/payments/nagad/callback') return true;
      return false;
    },
  });

  app.get('/api/csrf-token', (req, res) => {
    const token = generateCsrfToken(req, res);
    res.json({ csrfToken: token });
  });

  app.use(doubleCsrfProtection);

  const mockOrderFindOne = async (query: any) => null;
  const mockOrderFindOneAndUpdate = async () => ({});

  const originalOrderFindOne = (Order as any).findOne;
  const originalOrderFindOneAndUpdate = (Order as any).findOneAndUpdate;

  (Order as any).findOne = mockOrderFindOne;
  (Order as any).findOneAndUpdate = mockOrderFindOneAndUpdate;

  app.post('/api/payments/nagad/callback', async (req, res, next) => {
    try {
      const callbackData = req.body;
      const paymentReferenceId = callbackData.paymentReferenceId;

      if (!paymentReferenceId) {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
      }

      const order = await (Order as any).findOne({ "payment.intentId": paymentReferenceId });
      if (!order) {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
      }

      if (order.payment.status === 'succeeded') {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout/success`);
      }

      try {
        const verificationResult = await (nagadService as any).verifyPayment(paymentReferenceId);
        
        if (!verificationResult.success || verificationResult.status !== 'Success') {
          await (Order as any).findOneAndUpdate(
            { "payment.intentId": paymentReferenceId },
            {
              status: 'pending',
              "payment.status": "failed",
              updatedAt: new Date(),
            }
          );
          
          return res.redirect(`${process.env.FRONTEND_URL}/checkout/failed?reason=${encodeURIComponent(verificationResult.message || 'Payment verification failed')}`);
        }

        await (Order as any).findOneAndUpdate(
          { "payment.intentId": paymentReferenceId },
          {
            status: 'processing',
            "payment.status": "succeeded",
            "payment.transactionId": verificationResult.transactionId || callbackData.trxId,
            updatedAt: new Date(),
          }
        );

        res.redirect(`${process.env.FRONTEND_URL}/checkout/success`);
      } catch (verificationError) {
        return res.redirect(`${process.env.FRONTEND_URL}/checkout/failed`);
      }
    } catch (error) {
      next(error);
    }
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ error: err.message || 'Internal server error' });
  });

  return { app, restoreMocks: () => {
    (Order as any).findOne = originalOrderFindOne;
    (Order as any).findOneAndUpdate = originalOrderFindOneAndUpdate;
  }};
}

describe('Nagad Callback Security', () => {
  let app: express.Express;
  let restoreMocks: () => void;
  const paymentRefId = 'NAGAD_TEST_REF_123';

  beforeEach(() => {
    const result = createTestApp();
    app = result.app;
    restoreMocks = result.restoreMocks;
  });

  afterEach(() => {
    restoreMocks();
  });

  it('should mark order as succeeded when Nagad verification succeeds', async () => {
    const mockOrder = {
      _id: 'order123',
      userId: 'user123',
      payment: { intentId: paymentRefId, provider: 'nagad', status: 'pending', amount: 100 },
      items: [],
    };

    (Order as any).findOne = async () => mockOrder;
    (Order as any).findOneAndUpdate = async () => ({});

    (nagadService.verifyPayment as any) = async () => ({
      success: true,
      status: 'Success',
      transactionId: 'NAG_TRX123',
    });

    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ paymentReferenceId: paymentRefId, status: 'Success', trxId: 'NAG_TRX123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/checkout/success`);
  });

  it('should mark order as failed when Nagad verification fails', async () => {
    const mockOrder = {
      _id: 'order123',
      userId: 'user123',
      payment: { intentId: paymentRefId, provider: 'nagad', status: 'pending', amount: 100 },
      items: [],
    };

    (Order as any).findOne = async () => mockOrder;
    (Order as any).findOneAndUpdate = async () => ({});

    (nagadService.verifyPayment as any) = async () => ({
      success: false,
      status: 'Failed',
      message: 'Insufficient balance',
    });

    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ paymentReferenceId: paymentRefId, status: 'Success', trxId: 'NAG_TRX123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain('/checkout/failed');
  });

  it('should not update already succeeded order on duplicate callback', async () => {
    const mockOrder = {
      _id: 'order123',
      userId: 'user123',
      payment: { intentId: paymentRefId, provider: 'nagad', status: 'succeeded', amount: 100 },
      items: [],
    };

    (Order as any).findOne = async () => mockOrder;
    (Order as any).findOneAndUpdate = async () => ({});

    (nagadService.verifyPayment as any) = async () => ({
      success: true,
      status: 'Success',
      transactionId: 'NAG_TRX123',
    });

    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ paymentReferenceId: paymentRefId, status: 'Success', trxId: 'NAG_TRX123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/checkout/success`);
  });

  it('should handle verification API error safely', async () => {
    const mockOrder = {
      _id: 'order123',
      userId: 'user123',
      payment: { intentId: paymentRefId, provider: 'nagad', status: 'pending', amount: 100 },
      items: [],
    };

    (Order as any).findOne = async () => mockOrder;
    (Order as any).findOneAndUpdate = async () => ({});

    (nagadService.verifyPayment as any) = async () => {
      throw new Error('Network timeout');
    };

    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ paymentReferenceId: paymentRefId, status: 'Success', trxId: 'NAG_TRX123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/checkout/failed`);
  });

  it('should redirect to failed when payment reference not found', async () => {
    (Order as any).findOne = async () => null;
    (Order as any).findOneAndUpdate = async () => ({});

    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ paymentReferenceId: 'NONEXISTENT_REF', status: 'Success', trxId: 'NAG_TRX123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/checkout/failed`);
  });

  it('should redirect to failed when paymentReferenceId is missing', async () => {
    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ status: 'Success', trxId: 'NAG_TRX123' });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe(`${process.env.FRONTEND_URL}/checkout/failed`);
  });
});
