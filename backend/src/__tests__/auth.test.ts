import AuthUtils from '../utils/auth.js';

describe('AuthUtils', () => {
  describe('generateToken and verifyToken', () => {
    it('should generate and verify a token correctly', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        role: 'customer' as const,
      };

      const token = AuthUtils.generateToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const verified = AuthUtils.verifyToken(token);
      expect(verified).not.toBeNull();
      // JWT tokens include exp and iat fields, so we check the core payload matches
      expect(verified).toMatchObject({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      });
    });

    it('should return null for invalid token', () => {
      const verified = AuthUtils.verifyToken('invalid-token');
      expect(verified).toBeNull();
    });
  });

  describe('generateRefreshToken and verifyRefreshToken', () => {
    it('should generate and verify a refresh token correctly', () => {
      const payload = {
        userId: '123',
        email: 'test@example.com',
        role: 'customer' as const,
      };

      const tokenResult = AuthUtils.generateRefreshToken(payload);
      expect(tokenResult).toBeDefined();
      expect(tokenResult.token).toBeDefined();
      expect(typeof tokenResult.token).toBe('string');
      expect(tokenResult.tokenId).toBeDefined();
      expect(typeof tokenResult.tokenId).toBe('string');

      const verified = AuthUtils.verifyRefreshToken(tokenResult.token);
      expect(verified).not.toBeNull();
      // JWT tokens include exp and iat fields, so we check the core payload matches
      expect(verified).toMatchObject({
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        tokenId: tokenResult.tokenId,
      });
    });

    it('should return null for invalid refresh token', () => {
      const verified = AuthUtils.verifyRefreshToken('invalid-token');
      expect(verified).toBeNull();
    });
  });

  describe('hashPassword and comparePassword', () => {
    it('should hash and compare password correctly', async () => {
      const password = 'password123';
      const hashed = await AuthUtils.hashPassword(password);
      expect(hashed).toBeDefined();
      expect(typeof hashed).toBe('string');

      const isMatch = await AuthUtils.comparePassword(password, hashed);
      expect(isMatch).toBe(true);

      const isNotMatch = await AuthUtils.comparePassword('wrongpassword', hashed);
      expect(isNotMatch).toBe(false);
    });
  });
});
