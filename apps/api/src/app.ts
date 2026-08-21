import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import tourismRoutes from './routes/tourismRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import offeringRoutes from './routes/offeringRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import cityHubRoutes from './routes/cityHubRoutes.js';

const app = express();

app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors({
  origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'SETU Bihar Tourism API', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', tourismRoutes); // /api/circuits, /api/destinations, /api/districts, /api/events
app.use('/api', cityHubRoutes); // /api/city-hubs, /api/city-hubs/:slug
app.use('/api/vendors', vendorRoutes);
app.use('/api/offerings', offeringRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
