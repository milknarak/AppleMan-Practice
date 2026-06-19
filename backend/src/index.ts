import cors from 'cors';
import express from 'express';

import { ciRouter } from './routes/ci.routes.js';

const PORT = Number(process.env['PORT'] ?? 3000);

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/ci', ciRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// 404 fallthrough for /api
app.use('/api', (_req, res) => res.status(404).json({ error: 'not found' }));

// Centralized error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err);
  res.status(500).json({ error: 'internal server error' });
});

app.listen(PORT, () => {
  console.log(`AppleMan BE listening on http://localhost:${PORT}`);
});
