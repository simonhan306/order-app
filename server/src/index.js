import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { query } from './db/index.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Root - 안내 메시지
app.get('/', (req, res) => {
  res.json({
    message: 'Order App API Server',
    endpoints: {
      health: 'GET /api/health',
      menus: 'GET /api/menus (예정)',
      orders: 'GET /api/orders, POST /api/orders (예정)',
    },
    frontend: 'http://localhost:5173',
  });
});

// Health check (DB 연결 포함)
app.get('/api/health', async (req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', message: 'Order App Server is running', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message, db: 'disconnected' });
  }
});

// API routes will be added here
// app.use('/api/menus', menusRouter);
// app.use('/api/orders', ordersRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.listen(PORT, async () => {
  try {
    await query('SELECT 1');
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Database connected.');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    console.log('Server running without database. Run "npm run db:init" after creating the database.');
  }
});
