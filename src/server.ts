import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';
import { readFileSync } from 'node:fs';
import rateLimit from 'express-rate-limit';

const browserDistFolder = join(import.meta.dirname, '../browser');
const CONTENT_PATH = process.env['CONTENT_PATH'] ?? join(process.cwd(), 'content.json');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * API routes
 */
const apiRouter = express.Router();

apiRouter.get('/content', (_req, res) => {
  try {
    const raw = readFileSync(CONTENT_PATH, 'utf-8');
    res.json(JSON.parse(raw));
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
      res.status(404).json({ error: 'content.json not found on server' });
    } else {
      res.status(500).json({ error: 'Failed to read content' });
    }
  }
});

const contactLimiter = rateLimit({ windowMs: 10 * 60 * 1000, max: 5 });
apiRouter.post('/contact', contactLimiter, (_req, res) => {
  // Implemented in Plan 2 (requires MariaDB)
  res.status(501).json({ error: 'Not implemented yet' });
});

app.use(express.json({ limit: '10kb' }));
app.use('/api', apiRouter);

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
