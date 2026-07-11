process.env.JWT_SECRET = 'test_secret';
const { generateToken, verifyToken } = require('../../src/utils/jwt');

describe('JWT utils', () => {
  test('generates a token and verifies it back to the same payload', () => {
    const token = generateToken({ id: 'user-1', role: 'ADMIN' });
    expect(typeof token).toBe('string');

    const decoded = verifyToken(token);
    expect(decoded.id).toBe('user-1');
    expect(decoded.role).toBe('ADMIN');
  });

  test('throws when verifying an invalid token', () => {
    expect(() => verifyToken('not-a-valid-token')).toThrow();
  });
});
