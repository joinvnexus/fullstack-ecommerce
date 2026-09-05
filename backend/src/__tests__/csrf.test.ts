import { describe, it, expect } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import cookieParser from 'cookie-parser';
import { doubleCsrf } from 'csrf-csrf';

function createCsrfTestApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  const csrfSecret = process.env.CSRF_SECRET || 'dev-csrf-secret-change-in-production';
  const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
    getSecret: () => csrfSecret,
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

  // Protected browser-facing endpoint
  app.post('/api/payments/bkash/create', (req, res) => {
    res.json({ success: true });
  });

  // Provider callbacks (should be CSRF-exempt)
  app.post('/api/payments/stripe/webhook', (req, res) => {
    res.json({ received: true });
  });

  app.post('/api/payments/bkash/callback', (req, res) => {
    res.json({ success: true });
  });

  app.post('/api/payments/nagad/callback', (req, res) => {
    res.json({ success: true });
  });

  // Error handler to convert CSRF errors to proper responses
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).json({ error: 'Invalid CSRF token' });
    } else {
      res.status(500).json({ error: err.message || 'Internal server error' });
    }
  });

  return app;
}

describe('CSRF Protection', () => {
  let app: express.Express;

  beforeAll(() => {
    app = createCsrfTestApp();
  });

  it('should allow POST to Stripe webhook without CSRF token', async () => {
    const response = await request(app)
      .post('/api/payments/stripe/webhook')
      .send({ type: 'payment_intent.succeeded' });

    expect(response.status).toBe(200);
    expect(response.body.received).toBe(true);
  });

  it('should allow POST to bKash callback without CSRF token', async () => {
    const response = await request(app)
      .post('/api/payments/bkash/callback')
      .send({ paymentID: 'test123', status: 'success' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should allow POST to Nagad callback without CSRF token', async () => {
    const response = await request(app)
      .post('/api/payments/nagad/callback')
      .send({ paymentReferenceId: 'test456', status: 'Success' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('should reject POST to browser-facing endpoint without CSRF token', async () => {
    const response = await request(app)
      .post('/api/payments/bkash/create')
      .send({ orderId: '123', amount: 100 });

    expect(response.status).toBe(403);
  });

  it('should accept POST to browser-facing endpoint with valid CSRF token', async () => {
    const agent = request.agent(app);

    // First, get a CSRF token (cookie will be stored in agent)
    const tokenResponse = await agent.get('/api/csrf-token');
    expect(tokenResponse.status).toBe(200);
    const csrfToken = tokenResponse.body.csrfToken;

    const response = await agent
      .post('/api/payments/bkash/create')
      .set('x-csrf-token', csrfToken)
      .send({ orderId: '123', amount: 100 });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
