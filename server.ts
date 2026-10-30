import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import dotenv from 'dotenv';
import authRoutes from './src/server/routes/auth.ts';
import scanRoutes from './src/server/routes/scan.ts';
import logRoutes from './src/server/routes/logs.ts';
import { initDatabase } from './src/server/db.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Express middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database
await initDatabase();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/scan', scanRoutes);
app.use('/api/logs', logRoutes);
// Direct alias for /api/metrics
app.use('/api/metrics', (req, res, next) => {
  req.url = '/metrics' + (req.url === '/' ? '' : req.url);
  logRoutes(req, res, next);
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    system: 'TrustGuard AI',
    version: '1.0.0-enterprise',
    gemini_configured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Vite Middleware for Development / Static files for Production
if (!isProduction) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🛡️ TrustGuard AI Server running at http://0.0.0.0:${PORT}`);
  console.log(`🔒 Security posture scanner & LLM firewall active`);
});
