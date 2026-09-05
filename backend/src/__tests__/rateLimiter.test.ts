import { describe, it, expect, beforeAll } from '@jest/globals';
import express from 'express';
import request from 'supertest';
import { loginLimiter } from '../middleware/rateLimiter.js';

describe('loginLimiter', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.set('trust proxy', true);
    app.use(loginLimiter);
    app.post('/login', (req, res) => res.json({ success: true }));
  });

  it('should allow requests up to the rate limit', async () => {
    const maxAttempts = process.env.NODE_ENV === 'development' ? 10 : 5;

    for (let i = 0; i < maxAttempts; i++) {
      const response = await request(app)
        .post('/login')
        .set('X-Forwarded-For', '10.0.0.1');

      expect(response.status).not.toBe(429);
    }
  });

  it('should return 429 after exceeding the rate limit', async () => {
    const maxAttempts = process.env.NODE_ENV === 'development' ? 10 : 5;

    // Exceed the limit
    for (let i = 0; i < maxAttempts; i++) {
      await request(app)
        .post('/login')
        .set('X-Forwarded-For', '10.0.0.2');
    }

    // Next request should be rate limited
    const response = await request(app)
      .post('/login')
      .set('X-Forwarded-For', '10.0.0.2');

    expect(response.status).toBe(429);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Too many login attempts');
  });

  it('should rate limit independently per IP', async () => {
    const maxAttempts = process.env.NODE_ENV === 'development' ? 10 : 5;

    // Exceed limit for first IP
    for (let i = 0; i < maxAttempts; i++) {
      await request(app)
        .post('/login')
        .set('X-Forwarded-For', '10.0.0.3');
    }

    // Second IP should not be rate limited
    const response = await request(app)
      .post('/login')
      .set('X-Forwarded-For', '10.0.0.4');

    expect(response.status).not.toBe(429);
  });
});
