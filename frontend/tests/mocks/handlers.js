import { http, HttpResponse } from 'msw';

const API_URL = 'http://localhost:5000/api';

export const handlers = [
  http.get(`${API_URL}/products`, () => {
    return HttpResponse.json({
      items: [
        { id: 'p1', name: 'Wireless Mouse', price: 19.99, stock: 10, category: { name: 'Electronics' } },
        { id: 'p2', name: 'Mechanical Keyboard', price: 59.99, stock: 5, category: { name: 'Electronics' } },
      ],
      total: 2,
      page: 1,
      limit: 8,
      totalPages: 1,
    });
  }),

  http.get(`${API_URL}/categories`, () => {
    return HttpResponse.json([{ id: 'c1', name: 'Electronics' }]);
  }),

  http.post(`${API_URL}/auth/login`, async ({ request }) => {
    const body = await request.json();
    if (body.email === 'customer@shop.com' && body.password === 'Customer123!') {
      return HttpResponse.json({
        token: 'fake-jwt-token',
        user: { id: 'u1', name: 'Test Customer', email: body.email, role: 'CUSTOMER' },
      });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),
];
