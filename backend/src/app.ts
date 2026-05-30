import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { globalLimiter, authLimiter, uploadLimiter } from './middleware/rateLimiter';
import { requestLogger } from './middleware/requestLogger';

// Import Routes
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import rfqRoutes from './routes/rfqRoutes';
import orderRoutes from './routes/orderRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import uploadRoutes from './routes/uploadRoutes';
import supplierRoutes from './routes/supplierRoutes';
import adminRoutes from './routes/adminRoutes';
import messageRoutes from './routes/messageRoutes';

export const app = express();

app.use(cookieParser());

// ─── Security & Logging Middleware ───────────────────────────────────────────

// Helmet sets various HTTP headers for security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — whitelist only allowed origins
const allowedOrigins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}));

// Sanitize request data against NoSQL injection
app.use(mongoSanitize());

// Global rate limiter
if (env.NODE_ENV !== 'test') {
  app.use(globalLimiter);
}

// Request Logger (placed after rate limiter & sanitization, before routes)
app.use(requestLogger);

import { noCache } from './middleware/cacheControl';

// ─── Body Parsing & Compression ──────────────────────────────────────────────

app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(noCache);

// ─── Health Check ────────────────────────────────────────────────────────────

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Wholesale B2B API is running smoothly',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────

if (env.NODE_ENV === 'test') {
  app.use('/api/auth', authRoutes);
  app.use('/api/upload', uploadRoutes);
} else {
  app.use('/api/auth', authLimiter, authRoutes);
  app.use('/api/upload', uploadLimiter, uploadRoutes);
}

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/rfqs', rfqRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// ─── Error Handling ──────────────────────────────────────────────────────────

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
});

// Centralized error handler (must be last middleware)
app.use(errorHandler);

export default app;
