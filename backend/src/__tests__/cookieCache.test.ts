import request from 'supertest';
import { app } from '../app';
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

describe('Cookie & Cache Security Integration Tests', () => {
  let userEmail = 'cookie.test@example.com';
  let userPassword = 'password123';

  describe('Cookie Authentication', () => {
    it('should set a secure HttpOnly cookie on successful register', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Cookie Test User',
          email: userEmail,
          password: userPassword,
          role: 'buyer',
          companyName: 'Cookie Test Co',
          phone: '12345678901'
        });

      expect(response.status).toBe(201);
      
      // Verify cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(cookies[0]).toContain('HttpOnly');
      expect(cookies[0]).toContain('SameSite=Strict');
    });

    it('should set a secure HttpOnly cookie on successful login', async () => {
      // Register user first
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Cookie Test User',
          email: userEmail,
          password: userPassword,
          role: 'buyer',
          companyName: 'Cookie Test Co',
          phone: '12345678901'
        });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: userEmail,
          password: userPassword
        });

      expect(response.status).toBe(200);
      
      // Verify cookie is set
      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies[0]).toContain('token=');
      expect(cookies[0]).toContain('HttpOnly');
      expect(cookies[0]).toContain('SameSite=Strict');
    });

    it('should clear the auth cookie on logout', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Cookie Test User',
          email: userEmail,
          password: userPassword,
          role: 'buyer',
          companyName: 'Cookie Test Co',
          phone: '12345678901'
        });

      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: userEmail,
          password: userPassword
        });

      const cookies = loginRes.headers['set-cookie'];
      const tokenCookie = cookies[0].split(';')[0];

      // Logout request passing the cookie
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', [tokenCookie]);

      expect(response.status).toBe(200);
      
      // Verify cookie is cleared (expires in the past / empty)
      const logoutCookies = response.headers['set-cookie'];
      expect(logoutCookies).toBeDefined();
      expect(logoutCookies[0]).toContain('token=;');
      expect(logoutCookies[0]).toContain('Expires=Thu, 01 Jan 1970 00:00:00 GMT');
    });

    it('should authorize request using cookie token', async () => {
      // Register user
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Cookie Test User',
          email: userEmail,
          password: userPassword,
          role: 'buyer',
          companyName: 'Cookie Test Co',
          phone: '12345678901'
        });

      // Login to get token
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: userEmail,
          password: userPassword
        });

      const cookies = loginRes.headers['set-cookie'];
      const tokenCookie = cookies[0].split(';')[0];

      // Call profile with Cookie header
      const profileRes = await request(app)
        .get('/api/auth/profile')
        .set('Cookie', [tokenCookie]);

      expect(profileRes.status).toBe(200);
      expect(profileRes.body.email).toBe(userEmail);
    });
  });

  describe('Cache Control Security Headers', () => {
    it('should set no-cache headers on dynamic/authenticated routes', async () => {
      const response = await request(app).get('/api/auth/profile');
      
      expect(response.headers['cache-control']).toBe('no-store, no-cache, must-revalidate, proxy-revalidate');
      expect(response.headers['pragma']).toBe('no-cache');
      expect(response.headers['expires']).toBe('0');
    });

    it('should set public cache headers on categories route', async () => {
      const response = await request(app).get('/api/categories');
      
      expect(response.headers['cache-control']).toBe('public, max-age=300');
    });

    it('should set public cache headers on products route', async () => {
      const response = await request(app).get('/api/products');
      
      expect(response.headers['cache-control']).toBe('public, max-age=60');
    });
  });
});
