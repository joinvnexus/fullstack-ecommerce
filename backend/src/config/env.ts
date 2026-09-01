import logger from '../utils/logger.js';

const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'FRONTEND_URL',
];

const optionalEnvVars = [
  'CSRF_SECRET',
  'JWT_EXPIRE',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'BKASH_APP_KEY',
  'BKASH_APP_SECRET',
  'NAGAD_MERCHANT_ID',
  'NAGAD_MERCHANT_NUMBER',
  'NAGAD_PRIVATE_KEY',
  'NAGAD_PUBLIC_KEY',
  'REDIS_URL',
  'SMTP_HOST',
  'SMTP_USER',
  'SMTP_PASS',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'APP_URL',
  'API_URL',
];

interface EnvValidationResult {
  success: boolean;
  missing: string[];
  warnings: string[];
}

export const validateEnv = (): EnvValidationResult => {
  const missing: string[] = [];
  const warnings: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  for (const varName of optionalEnvVars) {
    if (!process.env[varName]) {
      warnings.push(varName);
    }
  }

  if (missing.length > 0) {
    logger.error('FATAL: Missing required environment variables:');
    missing.forEach((v) => logger.error(`  - ${v}`));
    logger.error('Application cannot start. Please check your .env file.');
    process.exit(1);
  }

  if (warnings.length > 0) {
    logger.warn('Missing optional environment variables (some features may be disabled):');
    warnings.forEach((v) => logger.warn(`  - ${v}`));
  }

  if (process.env.NODE_ENV === 'production' && !process.env.CSRF_SECRET) {
    logger.error('CSRF_SECRET is required in production. Set it with: openssl rand -hex 32');
    process.exit(1);
  }

  return { success: true, missing, warnings };
};

export default validateEnv;
