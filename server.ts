/**
 * Firm Expo — Production & Full-Stack Entry Point
 * Express server with Vite middleware integration and Meta API route handlers.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './src/server/routes';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Mount Section 17 REST API routes
  app.use('/api', apiRouter);

  // In development, mount Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static assets from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Firm Expo DM Campaign Manager running on http://0.0.0.0:${PORT}`);
  });
}

// Only start when invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startServer();
}

export default startServer;
