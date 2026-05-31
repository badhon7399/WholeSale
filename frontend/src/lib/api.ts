import { demoCategories, demoProducts, demoRfqs, demoOrders } from './demoData';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface RequestOptions extends RequestInit {
  token?: string;
}

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Response timeout fetch helper (1.8 seconds max limit)
async function fetchWithTimeout(url: string, options: RequestInit, timeout = 1800) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Fallback logic for reading data
function getFallbackData(endpoint: string): any {
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');

  // 1. Categories
  if (path === '/categories') {
    console.log('API Fallback: Loaded categories from local demo data');
    return demoCategories;
  }

  // 2. Products List
  if (path === '/products') {
    console.log('API Fallback: Loaded products from local demo data');
    const categorySlug = params.get('category');
    const search = params.get('search');
    
    let products = [...demoProducts];
    if (categorySlug) {
      products = products.filter(p => p.category.slug === categorySlug);
    }
    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q)
      );
    }
    
    return {
      products,
      total: products.length
    };
  }

  // 3. Single Product Details
  if (path.startsWith('/products/')) {
    const productId = path.split('/')[2];
    console.log('API Fallback: Loaded product details from local demo data:', productId);
    const prod = demoProducts.find(p => p._id === productId);
    if (prod) return prod;
  }

  // 4. RFQs List
  if (path === '/rfqs') {
    console.log('API Fallback: Loaded RFQs from local demo data');
    const categoryId = params.get('category');
    let rfqs = [...demoRfqs];
    if (categoryId) {
      rfqs = rfqs.filter(r => {
        const catId = typeof r.category === 'object' && r.category ? r.category._id : r.category;
        return catId === categoryId;
      });
    }
    return rfqs;
  }

  // 5. Buyer stats
  if (path === '/dashboard/buyer-stats') {
    console.log('API Fallback: Loaded buyer stats from local demo data');
    const totalSpend = demoOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      activeOrdersCount: demoOrders.filter(o => o.deliveryStatus !== 'delivered' && o.deliveryStatus !== 'cancelled').length,
      totalSpend,
      openRfqsCount: demoRfqs.filter(r => r.status === 'open').length
    };
  }

  // 6. Supplier stats
  if (path === '/dashboard/supplier-stats') {
    console.log('API Fallback: Loaded supplier stats from local demo data');
    const totalRevenue = demoOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      pendingOrdersCount: demoOrders.filter(o => o.deliveryStatus === 'processing').length,
      totalRevenue,
      activeProductsCount: demoProducts.length
    };
  }

  // 7. Orders for Buyer
  if (path === '/orders/buyer') {
    console.log('API Fallback: Loaded orders for buyer');
    return demoOrders;
  }

  // 8. Orders for Supplier
  if (path === '/orders/supplier') {
    console.log('API Fallback: Loaded orders for supplier');
    return demoOrders;
  }

  return null;
}

// Fallback logic for writing data (simulates backend state mutations in-memory)
function handleFallbackWrite(method: string, endpoint: string, body: any): any {
  const [path] = endpoint.split('?');

  if (method === 'POST' && path === '/rfqs') {
    console.log('API Fallback: Created RFQ in local demo data');
    const newRfq = {
      _id: `rfq_${Date.now()}`,
      title: body.title,
      description: body.description,
      category: {
        _id: body.category,
        name: demoCategories.find(c => c._id === body.category)?.name || 'Fashion & Apparel'
      },
      quantity: Number(body.quantity),
      targetPrice: Number(body.targetPrice),
      deliveryLocation: body.deliveryLocation,
      requiredDate: body.requiredDate,
      status: 'open' as const,
      buyer: {
        _id: 'buy_local_123',
        name: 'Guest Buyer',
        companyName: 'Local Corporate Buyer Ltd'
      },
      bids: []
    };
    demoRfqs.unshift(newRfq);
    return newRfq;
  }

  if (method === 'POST' && path.startsWith('/rfqs/') && path.endsWith('/bid')) {
    const rfqId = path.split('/')[2];
    console.log('API Fallback: Submitted bid in local demo data for RFQ:', rfqId);
    const rfq = demoRfqs.find(r => r._id === rfqId);
    if (rfq) {
      const newBid = {
        _id: `bid_${Date.now()}`,
        supplier: {
          _id: 'sup_local_123',
          name: 'Guest Supplier',
          companyName: 'Local Verified Supplier Ltd',
          isVerified: true
        },
        offeredPrice: Number(body.offeredPrice),
        message: body.message,
        status: 'pending' as const
      };
      if (!rfq.bids) rfq.bids = [];
      rfq.bids.unshift(newBid);
      return rfq;
    }
  }

  if (method === 'PATCH' && path.startsWith('/rfqs/') && path.includes('/bid/')) {
    const parts = path.split('/');
    const rfqId = parts[2];
    const bidId = parts[4];
    console.log('API Fallback: Accepted bid in local demo data:', bidId, 'on RFQ:', rfqId);
    const rfq = demoRfqs.find(r => r._id === rfqId);
    if (rfq) {
      const bid = rfq.bids.find(b => b._id === bidId);
      if (bid) {
        bid.status = 'accepted';
      }
      return rfq;
    }
  }

  if (method === 'POST' && path === '/products') {
    console.log('API Fallback: Listed product in local demo data');
    const newProd = {
      _id: `prod_${Date.now()}`,
      title: body.title,
      description: body.description,
      images: body.images || ['https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80'],
      category: {
        _id: body.category,
        name: demoCategories.find(c => c._id === body.category)?.name || 'Fashion & Apparel',
        slug: demoCategories.find(c => c._id === body.category)?.slug || 'fashion-apparel'
      },
      supplier: {
        _id: 'sup_local_123',
        name: 'Guest Supplier',
        companyName: 'Local Verified Supplier Ltd',
        isVerified: true,
        rating: 4.8,
        reviewCount: 1
      },
      moq: Number(body.moq),
      priceTiers: body.priceTiers || [],
      specifications: {
        'Origin': 'Dhaka, Bangladesh',
        'Supply Ability': '10,000 units/week'
      },
      stock: Number(body.stock),
      leadTime: '15 days',
      shippingOrigin: 'Dhaka'
    };
    demoProducts.unshift(newProd);
    return newProd;
  }

  if (method === 'PUT' && path.startsWith('/orders/') && path.endsWith('/status')) {
    const orderId = path.split('/')[2];
    console.log('API Fallback: Updated order status in local demo data for order:', orderId);
    const order = demoOrders.find(o => o._id === orderId);
    if (order) {
      if (body.deliveryStatus) order.deliveryStatus = body.deliveryStatus;
      if (body.paymentStatus) order.paymentStatus = body.paymentStatus;
      return order;
    }
  }

  if (method === 'PUT' && path.startsWith('/rfqs/') && path.includes('/accept/')) {
    const parts = path.split('/');
    const rfqId = parts[2];
    const bidId = parts[4];
    console.log('API Fallback: Accepted bid in local demo data:', bidId, 'on RFQ:', rfqId);
    const rfq = demoRfqs.find(r => r._id === rfqId);
    if (rfq) {
      rfq.status = 'closed';
      const bid = rfq.bids.find(b => b._id === bidId);
      if (bid) {
        bid.status = 'accepted';
        
        // Create matching order for this transaction
        const newOrder = {
          _id: `ord_${Date.now()}`,
          buyer: rfq.buyer,
          supplier: bid.supplier,
          items: [
            {
              product: {
                _id: 'prod_custom_123',
                title: rfq.title
              },
              quantity: rfq.quantity,
              price: bid.offeredPrice
            }
          ],
          totalAmount: rfq.quantity * bid.offeredPrice,
          shippingAddress: rfq.deliveryLocation,
          phone: '+8801711000000',
          paymentStatus: 'pending' as const,
          deliveryStatus: 'processing' as const,
          createdAt: new Date().toISOString()
        };
        demoOrders.unshift(newOrder);
      }
      return rfq;
    }
  }

  return null;
}

export const api = {
  async get<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'GET',
        credentials: 'include',
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        throw new Error('Response status not ok');
      }

      return response.json();
    } catch (error) {
      console.warn(`GET ${endpoint} failed or timed out. Falling back to local data...`, error);
      const fallback = getFallbackData(endpoint);
      if (fallback !== null) {
        return fallback as T;
      }
      throw error;
    }
  },

  async post<T = any>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'POST',
        credentials: 'include',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Response status not ok');
      }

      return response.json();
    } catch (error) {
      console.warn(`POST ${endpoint} failed. Simulating locally...`, error);
      const fallback = handleFallbackWrite('POST', endpoint, body);
      if (fallback !== null) {
        return fallback as T;
      }
      throw error;
    }
  },

  async put<T = any>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'PUT',
        credentials: 'include',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Response status not ok');
      }

      return response.json();
    } catch (error) {
      console.warn(`PUT ${endpoint} failed. Simulating locally...`, error);
      const fallback = handleFallbackWrite('PUT', endpoint, body);
      if (fallback !== null) {
        return fallback as T;
      }
      throw error;
    }
  },

  async patch<T = any>(endpoint: string, body: any, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'PATCH',
        credentials: 'include',
        headers: { ...headers, ...options.headers },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Response status not ok');
      }

      return response.json();
    } catch (error) {
      console.warn(`PATCH ${endpoint} failed. Simulating locally...`, error);
      const fallback = handleFallbackWrite('PATCH', endpoint, body);
      if (fallback !== null) {
        return fallback as T;
      }
      throw error;
    }
  },

  async delete<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const headers = getHeaders(options.token);
    try {
      const response = await fetchWithTimeout(`${API_BASE_URL}${endpoint}`, {
        ...options,
        method: 'DELETE',
        credentials: 'include',
        headers: { ...headers, ...options.headers },
      });

      if (!response.ok) {
        throw new Error('Response status not ok');
      }

      return response.json();
    } catch (error) {
      console.warn(`DELETE ${endpoint} failed. Simulating locally...`, error);
      throw error;
    }
  },
};
