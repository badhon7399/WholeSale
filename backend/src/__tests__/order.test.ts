import request from 'supertest';
import app from '../app';
import { connectTestDb, closeTestDb, clearTestDb } from './setup';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Order } from '../models/Order';

beforeAll(async () => {
  await connectTestDb();
});

afterAll(async () => {
  await closeTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

describe('Order API', () => {
  let supplierCookie: string;
  let supplierId: string;
  let buyerCookie: string;
  let testCategory: any;
  let testProduct: any;

  const mockSupplier = {
    name: 'Order Supplier',
    email: 'supplier@test.com',
    password: 'password123',
    role: 'supplier',
    companyName: 'Supplier Co.',
    phone: '01811112222',
  };

  const mockBuyer = {
    name: 'Order Buyer',
    email: 'buyer@test.com',
    password: 'password123',
    role: 'buyer',
    companyName: 'Buyer Co.',
    phone: '01711112222',
  };

  beforeEach(async () => {
    // 1. Create Category
    testCategory = await Category.create({
      name: 'Textiles',
      slug: 'textiles',
      description: 'Textile materials',
    });

    // 2. Register Supplier
    const supplierRes = await request(app)
      .post('/api/auth/register')
      .send(mockSupplier);
    supplierCookie = supplierRes.headers['set-cookie'][0].split(';')[0];
    supplierId = supplierRes.body.user.id;

    // 3. Register Buyer
    const buyerRes = await request(app)
      .post('/api/auth/register')
      .send(mockBuyer);
    buyerCookie = buyerRes.headers['set-cookie'][0].split(';')[0];

    // 4. Create Product with stock=50, moq=10, priceTiers
    testProduct = await Product.create({
      title: 'Bulk Cotton Rolls',
      description: 'Raw premium cotton rolls for manufacturing.',
      category: testCategory._id,
      supplier: supplierId,
      moq: 10,
      stock: 50,
      priceTiers: [
        { minQuantity: 10, pricePerUnit: 100 },
        { minQuantity: 30, pricePerUnit: 80 },
      ],
    });
  });

  describe('POST /api/orders', () => {
    it('should place an order successfully, reduce stock, and calculate price tier', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Cookie', [buyerCookie])
        .send({
          supplier: supplierId,
          items: [
            {
              product: testProduct._id.toString(),
              quantity: 35, // matches tier 2 (pricePerUnit = 80)
            },
          ],
          paymentMethod: 'cod',
          shippingAddress: 'Mirpur, Dhaka, Bangladesh',
          phone: '01711112222',
        });

      expect(res.status).toBe(201);
      expect(res.body).toBeDefined();
      expect(res.body.totalAmount).toBe(35 * 80); // 2800
      expect(res.body.items[0].price).toBe(80);

      // Verify product stock is decremented from 50 to 15
      const dbProduct = await Product.findById(testProduct._id);
      expect(dbProduct?.stock).toBe(15);
    });

    it('should reject order if quantity is less than MOQ', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Cookie', [buyerCookie])
        .send({
          supplier: supplierId,
          items: [
            {
              product: testProduct._id.toString(),
              quantity: 5, // MOQ is 10
            },
          ],
          paymentMethod: 'bank',
          shippingAddress: 'Gulshan, Dhaka, Bangladesh',
          phone: '01711112222',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('meet the minimum order quantity');

      // Stock should remain unchanged
      const dbProduct = await Product.findById(testProduct._id);
      expect(dbProduct?.stock).toBe(50);
    });

    it('should reject order if quantity exceeds stock', async () => {
      const res = await request(app)
        .post('/api/orders')
        .set('Cookie', [buyerCookie])
        .send({
          supplier: supplierId,
          items: [
            {
              product: testProduct._id.toString(),
              quantity: 60, // stock is 50
            },
          ],
          paymentMethod: 'mfs',
          shippingAddress: 'Banani, Dhaka, Bangladesh',
          phone: '01711112222',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Insufficient stock');

      // Stock should remain unchanged
      const dbProduct = await Product.findById(testProduct._id);
      expect(dbProduct?.stock).toBe(50);
    });
  });
});
