import request from 'supertest';
import app from '../app';
import { connectTestDb, closeTestDb, clearTestDb } from './setup';
import { User } from '../models/User';

beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

describe('Authentication API', () => {
  const mockBuyer = {
    name: 'Test Buyer',
    email: 'buyer@test.com',
    password: 'password123',
    role: 'buyer',
    companyName: 'Buyer Co.',
    phone: '01712345678',
  };

  const mockSupplier = {
    name: 'Test Supplier',
    email: 'supplier@test.com',
    password: 'password123',
    role: 'supplier',
    companyName: 'Supplier Ltd.',
    phone: '01812345678',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new buyer successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(mockBuyer);

      expect(res.status).toBe(201);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(res.body.user).toHaveProperty('name', mockBuyer.name);
      expect(res.body.user).toHaveProperty('email', mockBuyer.email);
      expect(res.body.user).toHaveProperty('role', 'buyer');
      expect(res.body.user).not.toHaveProperty('password');

      const userInDb = await User.findOne({ email: mockBuyer.email });
      expect(userInDb).toBeDefined();
      expect(userInDb?.role).toBe('buyer');
    });

    it('should register a new supplier successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(mockSupplier);

      expect(res.status).toBe(201);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(res.body.user).toHaveProperty('role', 'supplier');
      expect(res.body.user).toHaveProperty('companyName', mockSupplier.companyName);
    });

    it('should not register a user with an already existing email', async () => {
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(mockBuyer);

      // Duplicate registration
      const res = await request(app)
        .post('/api/auth/register')
        .send(mockBuyer);

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('message');
      expect(res.body.message.toLowerCase()).toContain('already exists');
    });

    it('should fail validation if password is under 6 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          ...mockBuyer,
          password: '123',
        });

      // Express-validator should catch it or Mongoose validation will catch it
      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Pre-create the user
      await request(app)
        .post('/api/auth/register')
        .send(mockBuyer);
    });

    it('should log in successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockBuyer.email,
          password: mockBuyer.password,
        });

      expect(res.status).toBe(200);
      const cookies = res.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(res.body.user).toHaveProperty('email', mockBuyer.email);
    });

    it('should reject login with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: mockBuyer.email,
          password: 'wrongpassword',
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message');
    });

    it('should reject login for a non-existent email', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'password123',
        });

      expect(res.status).toBe(401);
    });
  });
});
