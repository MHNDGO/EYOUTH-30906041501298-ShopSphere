process.env.JWT_SECRET = 'test_secret';

jest.mock('../../src/lib/prisma', () => ({
  product: {
    findMany: jest.fn(),
    count: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  category: {
    findUnique: jest.fn(),
  },
}));

const request = require('supertest');
const app = require('../../src/app');
const prisma = require('../../src/lib/prisma');
const { generateToken } = require('../../src/utils/jwt');

describe('Product API', () => {
  beforeEach(() => jest.clearAllMocks());

  test('GET /api/products returns a paginated list', async () => {
    prisma.product.findMany.mockResolvedValue([
      { id: 'p1', name: 'Mouse', price: 19.99 },
    ]);
    prisma.product.count.mockResolvedValue(1);

    const res = await request(app).get('/api/products?page=1&limit=12');
    expect(res.status).toBe(200);
    expect(res.body.items).toHaveLength(1);
    expect(res.body.total).toBe(1);
  });

  test('GET /api/products/:id returns 404 for unknown product', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    const res = await request(app).get('/api/products/does-not-exist');
    expect(res.status).toBe(404);
  });

  test('POST /api/products is blocked without a token', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'New product',
      description: 'desc',
      price: 10,
      categoryId: 'c1',
    });
    expect(res.status).toBe(401);
  });

  test('POST /api/products is blocked for a non-admin (CUSTOMER) token', async () => {
    const token = generateToken({ id: 'u1', role: 'CUSTOMER' });
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'New product', description: 'desc', price: 10, categoryId: 'c1' });
    expect(res.status).toBe(403);
  });

  test('POST /api/products succeeds for an ADMIN token', async () => {
    const token = generateToken({ id: 'admin1', role: 'ADMIN' });
    prisma.category.findUnique.mockResolvedValue({ id: 'c1', name: 'Electronics' });
    prisma.product.create.mockResolvedValue({
      id: 'p2',
      name: 'New product',
      description: 'desc',
      price: 10,
      categoryId: 'c1',
    });

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .field('name', 'New product')
      .field('description', 'desc')
      .field('price', '10')
      .field('categoryId', 'c1');

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New product');
  });
});
