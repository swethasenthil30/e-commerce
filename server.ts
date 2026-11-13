import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDatabase, localDb } from './backend/config/db.js';
import authRoutes from './backend/routes/authRoutes.js';
import productRoutes from './backend/routes/productRoutes.js';
import orderRoutes from './backend/routes/orderRoutes.js';
import statsRoutes from './backend/routes/statsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Global middlewares
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Connect Database (MongoDB or resilient persistent local store)
  await connectDatabase();

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/stats', statsRoutes);

  // Health and System Info Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        mode: localDb.mode,
        connected: localDb.isConnected,
        totalProducts: localDb.products.length,
        totalOrders: localDb.orders.length,
        totalUsers: localDb.users.length
      }
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In development, mount Vite dev server middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[Dev] Vite middleware attached for hot frontend loading.');
  } else {
    // In production, serve built static assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`  NovaMart Full-Stack Platform Active!   `);
    console.log(`  Server Port: http://localhost:${PORT} `);
    console.log(`  Database Mode: ${localDb.mode.toUpperCase()}`);
    console.log(`=========================================`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
