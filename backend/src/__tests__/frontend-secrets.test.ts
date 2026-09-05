import { describe, it, expect } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const settingsPagePath = path.join(__dirname, '..', '..', '..', 'frontend', 'src', 'app', 'admin', 'settings', 'page.tsx');

describe('Frontend secret exposure', () => {
  it('should not contain hardcoded Stripe secret key placeholders', () => {
    const content = fs.readFileSync(settingsPagePath, 'utf-8');
    expect(content).not.toMatch(/stripeSecretKey\s*:/);
    expect(content).not.toMatch(/sk_test_\.\.\./);
  });

  it('should not contain hardcoded bKash credential placeholders', () => {
    const content = fs.readFileSync(settingsPagePath, 'utf-8');
    expect(content).not.toMatch(/bkashAppKey\s*:/);
    expect(content).not.toMatch(/bkashAppSecret\s*:/);
    expect(content).not.toMatch(/bkash_app_secret/);
  });

  it('should not contain hardcoded SMTP password placeholders', () => {
    const content = fs.readFileSync(settingsPagePath, 'utf-8');
    expect(content).not.toMatch(/smtpPassword\s*:/);
    expect(content).not.toMatch(/smtpPassword:\s*'password'/);
  });
});
