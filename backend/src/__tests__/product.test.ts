import request from 'supertest';
import app from '../app';
import { connectTestDb, closeTestDb, clearTestDb } from './setup';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
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

describe('Product API', () => {
  let supplierCookie: string;
  let supplierId: string;
  let buyerCookie: string;
  let testCategory: any;

  const mockSupplier = {
    name: 'Product Supplier',
    email: 'supplier@test.com',
    password: 'password123',
    role: 'supplier',
    companyName: 'Supplier Co.',
    phone: '01811112222',
  };

  const mockBuyer = {
    name: 'Product Buyer',
    email: 'buyer@test.com',
    password: 'password123',
    role: 'buyer',
    companyName: 'Buyer Co.',
    phone: '01711112222',
  };

  beforeEach(async () => {
    // 1. Create a Category
    testCategory = await Category.create({
      name: 'Electronics',
      slug: 'electronics',
      description: 'Electronic products',
    });

    // 2. Register supplier & get cookie & id
    const supplierRes = await request(app)
      .post('/api/auth/register')
      .send(mockSupplier);
    supplierCookie = supplierRes.headers['set-cookie'][0].split(';')[0];
    supplierId = supplierRes.body.user.id;

    // 3. Register buyer & get cookie
    const buyerRes = await request(app)
      .post('/api/auth/register')
      .send(mockBuyer);
    buyerCookie = buyerRes.headers['set-cookie'][0].split(';')[0];
  });

  describe('POST /api/products', () => {
    it('should allow supplier to create a product successfully', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', [supplierCookie])
        .send({
          title: 'Bulk Cables 100m',
          description: 'High-quality copper networking cables in bulk packaging.',
          category: testCategory._id.toString(),
          moq: 10,
          stock: 100,
          priceTiers: [
            { minQuantity: 10, pricePerUnit: 15 },
            { minQuantity: 51, pricePerUnit: 12 },
          ],
        });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('title', 'Bulk Cables 100m');
      expect(res.body).toHaveProperty('moq', 10);
      expect(res.body.priceTiers).toHaveLength(2);
    });

    it('should reject product creation if category is invalid', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', [supplierCookie])
        .send({
          title: 'Bulk Cables 100m',
          description: 'High-quality copper networking cables in bulk packaging.',
          category: '507f1f77bcf86cd799439011', // invalid or non-existent
          moq: 10,
          stock: 100,
          priceTiers: [{ minQuantity: 10, pricePerUnit: 15 }],
        });

      expect(res.status).toBe(400);
    });

    it('should deny access to buyer for creating a product', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', [buyerCookie])
        .send({
          title: 'Illegal Buyer Product',
          description: 'Should fail',
          category: testCategory._id.toString(),
          moq: 10,
          stock: 100,
          priceTiers: [{ minQuantity: 10, pricePerUnit: 15 }],
        });

      expect(res.status).toBe(403);
    });
  });

  describe('GET and DELETE /api/products', () => {
    let createdProduct: any;

    beforeEach(async () => {
      createdProduct = await Product.create({
        title: 'Industrial Heavy Fan',
        description: 'Large high-velocity shop fan.',
        category: testCategory._id,
        supplier: supplierId,
        moq: 5,
        stock: 50,
        priceTiers: [{ minQuantity: 5, pricePerUnit: 120 }],
      });
    });

    it('should fetch a list of products', async () => {
      const res = await request(app)
        .get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('products');
      expect(res.body.products).toBeInstanceOf(Array);
      expect(res.body.products.length).toBeGreaterThanOrEqual(1);
    });

    it('should soft delete product and exclude it from listings', async () => {
      // Delete request
      const deleteRes = await request(app)
        .delete(`/api/products/${createdProduct._id}`)
        .set('Cookie', [supplierCookie]);

      expect(deleteRes.status).toBe(200);
      expect(deleteRes.body.message).toContain('deleted');

      // Verify product is not in main GET listing anymore
      const listRes = await request(app)
        .get('/api/products');
      
      const found = listRes.body.products.find((p: any) => p._id === createdProduct._id.toString());
      expect(found).toBeUndefined();

      // Verify it still exists in the database with isDeleted true (soft-deleted)
      const dbProduct = await Product.findById(createdProduct._id).setOptions({ skipDeletedFilter: true });
      expect(dbProduct).not.toBeNull();
      expect(dbProduct?.isDeleted).toBe(true);
    });
  });
});
