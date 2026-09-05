import { describe, it, expect, beforeEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { doubleCsrf } from 'csrf-csrf';
import paymentRoutes from '../routes/payments.js';
import Order from '../models/Order.js';

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
  app.use('/api/payments', paymentRoutes);

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({ error: 'Invalid CSRF token' });
    } else {
      res.status(err.statusCode || 500).json({ error: err.message || 'Internal server error' });
    }
  });

  return app;
}

describe('Payment Execute/Verify Security', () => {
  let app: express.Express;
  const userAId = '60d5ec49f1b2c8b1f8c4b123';
  const userBId = '60d5ec49f1b2c8b1f8c4b456';
  const paymentId = 'BKASH_TEST_PAYMENT_123';

  beforeEach(() => {
    app = createTestApp();
    // Override Order.findOne to avoid MongoDB connection in tests
    (Order as any).findOne = async () => null;
  });

  describe('POST /api/payments/bkash/execute', () => {
    it('should reject unauthenticated request without CSRF token (CSRF blocks before auth)', async () => {
      const response = await request(app)
        .post('/api/payments/bkash/execute')
        .set('x-csrf-token', 'dummy')
        .send({ paymentID: paymentId });

      expect(response.status).toBe(403);
    });

    it('should reject request without CSRF token even with auth cookie', async () => {
      const token = generateToken(userAId);

      const response = await request(app)
        .post('/api/payments/bkash/execute')
        .set('Cookie', `accessToken=${token}`)
        .send({ paymentID: paymentId });

      expect(response.status).toBe(403);
    });

    it('should reject request with missing paymentID', async () => {
      const token = generateToken(userAId);

      const agent = request.agent(app);
      const tokenResponse = await agent.get('/api/csrf-token');
      const csrfToken = tokenResponse.body.csrfToken;

      const response = await agent
        .post('/api/payments/bkash/execute')
        .set('Cookie', `accessToken=${token}`)
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should reject authenticated user when order is not found', async () => {
      const token = generateToken(userAId);
      (Order as any).findOne = async () => null;

      const agent = request.agent(app);
      const tokenResponse = await agent.get('/api/csrf-token');
      const csrfToken = tokenResponse.body.csrfToken;

      const response = await agent
        .post('/api/payments/bkash/execute')
        .set('Cookie', `accessToken=${token}`)
        .set('x-csrf-token', csrfToken)
        .send({ paymentID: paymentId });

      expect(response.status).toBe(404);
    });

    it('should reject authenticated user when order belongs to another user', async () => {
      const token = generateToken(userAId);
      const otherUserOrder = {
        _id: 'order123',
        userId: userBId,
        payment: { intentId: paymentId, provider: 'bkash' },
        toString: () => userBId,
      };

      (Order as any).findOne = async () => otherUserOrder;

      const agent = request.agent(app);
      const tokenResponse = await agent.get('/api/csrf-token');
      const csrfToken = tokenResponse.body.csrfToken;

      const response = await agent
        .post('/api/payments/bkash/execute')
        .set('Cookie', `accessToken=${token}`)
        .set('x-csrf-token', csrfToken)
        .send({ paymentID: paymentId });

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/payments/nagad/verify', () => {
    it('should reject unauthenticated request without CSRF token', async () => {
      const response = await request(app)
        .post('/api/payments/nagad/verify')
        .set('x-csrf-token', 'dummy')
        .send({ paymentRefId: 'NAGAD_REF_123' });

      expect(response.status).toBe(403);
    });

    it('should reject request without CSRF token even with auth cookie', async () => {
      const token = generateToken(userAId);

      const response = await request(app)
        .post('/api/payments/nagad/verify')
        .set('Cookie', `accessToken=${token}`)
        .send({ paymentRefId: 'NAGAD_REF_123' });

      expect(response.status).toBe(403);
    });

    it('should reject request with missing paymentRefId', async () => {
      const token = generateToken(userAId);

      const agent = request.agent(app);
      const tokenResponse = await agent.get('/api/csrf-token');
      const csrfToken = tokenResponse.body.csrfToken;

      const response = await agent
        .post('/api/payments/nagad/verify')
        .set('Cookie', `accessToken=${token}`)
        .set('x-csrf-token', csrfToken)
        .send({});

      expect(response.status).toBe(400);
    });

    it('should reject authenticated user when order is not found', async () => {
      const token = generateToken(userAId);
      (Order as any).findOne = async () => null;

      const agent = request.agent(app);
      const tokenResponse = await agent.get('/api/csrf-token');
      const csrfToken = tokenResponse.body.csrfToken;

      const response = await agent
        .post('/api/payments/nagad/verify')
        .set('Cookie', `accessToken=${token}`)
        .set('x-csrf-token', csrfToken)
        .send({ paymentRefId: 'NAGAD_REF_123' });

      expect(response.status).toBe(404);
    });

    it('should reject authenticated user when order belongs to another user', async () => {
      const token = generateToken(userAId);
      const otherUserOrder = {
        _id: 'order456',
        userId: userBId,
        payment: { intentId: 'NAGAD_REF_123', provider: 'nagad' },
        toString: () => userBId,
      };

      (Order as any).findOne = async () => otherUserOrder;

      const agent = request.agent(app);
      const tokenResponse = await agent.get('/api/csrf-token');
      const csrfToken = tokenResponse.body.csrfToken;

      const response = await agent
        .post('/api/payments/nagad/verify')
        .set('Cookie', `accessToken=${token}`)
        .set('x-csrf-token', csrfToken)
        .send({ paymentRefId: 'NAGAD_REF_123' });

      expect(response.status).toBe(404);
    });
  });
});
