// Jest setup file for setting environment variables
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-testing-only';
process.env.JWT_EXPIRE = '7d';
process.env.MONGODB_URI = 'mongodb://localhost:27017/test';
process.env.STRIPE_SECRET_KEY = 'sk_test_stripe_key';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_webhook_secret';
