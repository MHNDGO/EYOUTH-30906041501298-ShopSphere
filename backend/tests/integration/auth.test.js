process.env.JWT_SECRET = 'test_secret';

jest.mock('../../src/lib/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
}));
jest.mock('../../src/models/ActivityLog', () => ({ create: jest.fn().mockResolvedValue({}) }));
jest.mock('../../src/utils/email', () => ({ sendWelcomeEmail: jest.fn().mockResolvedValue({}) }));

const request = require('supertest');
const bcrypt = require('bcryptjs');
const app = require('../../src/app');
const prisma = require('../../src/lib/prisma');

describe('Auth API', () => {
  beforeEach(() => jest.clearAllMocks());

  test('POST /api/auth/register rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'a@a.com' });
    expect(res.status).toBe(400);
  });

  test('POST /api/auth/register creates a user and returns a token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({
      id: 'u1',
      name: 'Alice',
      email: 'alice@example.com',
      role: 'CUSTOMER',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('alice@example.com');
  });

  test('POST /api/auth/login rejects bad credentials', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const res = await request(app).post('/api/auth/login').send({
      email: 'nouser@example.com',
      password: 'wrongpass',
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/auth/login succeeds with correct credentials', async () => {
    const hashed = await bcrypt.hash('correctpass', 10);
    prisma.user.findUnique.mockResolvedValue({
      id: 'u2',
      name: 'Bob',
      email: 'bob@example.com',
      password: hashed,
      role: 'CUSTOMER',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'bob@example.com',
      password: 'correctpass',
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('GET /api/auth/me requires a token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
