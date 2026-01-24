import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
  keyGenerator: (req: any) =>
    req.user ? `user_${req.user.userId}` : ipKeyGenerator(req),
  skip: req =>
    req.path === '/api/health' || req.path === '/api/test',
});
