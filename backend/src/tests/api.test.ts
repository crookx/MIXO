import request from 'supertest';
import { app } from '../app';
import { User } from '../models/User';

let authToken: string;

beforeAll(async () => {
  // Login and get token
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'admin@test.com',
      password: 'password123'
    });
  
  authToken = response.body.token;
});

describe('Product API', () => {
  test('GET /api/products should return products list', async () => {
    const response = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('GET /api/products/:id should return a single product', async () => {
    const response = await request(app)
      .get(`/api/products/${testProduct._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(testProduct.name);
  });

  test('POST /api/products should create a new product', async () => {
    const newProduct = {
      name: 'Another Test Product',
      description: 'Test Description',
      price: 1999,
      category: testCategory._id.toString(),
      subcategory: 'Test Subcategory',
      sizes: ['S', 'M', 'L'],
      colors: ['Black'],
      stock: 10,
      status: 'active'
    };

    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newProduct);

    expect(response.status).toBe(201);
    expect(response.body._id).toBeDefined();
    expect(response.body.name).toBe(newProduct.name);
  });
});
