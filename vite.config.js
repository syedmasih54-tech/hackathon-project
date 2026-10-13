import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { processDocumentOcr, draftGrievanceComplaint } from './server/geminiService.js';
import { checkRateLimit } from './server/rateLimiter.js';

// Custom plugin to provide local dev API routes matching Vercel/Netlify serverless endpoints
function localServerlessApiPlugin() {
  return {
    name: 'local-serverless-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];

        if (url === '/api/ocr' && req.method === 'POST') {
          const clientIp = req.socket?.remoteAddress || '127.0.0.1';
          const rateLimit = checkRateLimit(clientIp);

          if (!rateLimit.allowed) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'rate_limited',
              message: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds.`
            }));
            return;
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const { imageBase64, mimeType } = parsed;

              if (!imageBase64) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'missing_image' }));
                return;
              }

              // Document is processed in memory and never logged
              const result = await processDocumentOcr(imageBase64, mimeType);
              res.statusCode = result.success ? 200 : 502;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.success ? result.data : result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'server_error', message: err.message }));
            }
          });
          return;
        }

        if (url === '/api/complaint' && req.method === 'POST') {
          const clientIp = req.socket?.remoteAddress || '127.0.0.1';
          const rateLimit = checkRateLimit(clientIp);

          if (!rateLimit.allowed) {
            res.statusCode = 429;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              error: 'rate_limited',
              message: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds.`
            }));
            return;
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const facts = JSON.parse(body || '{}');
              const result = await draftGrievanceComplaint(facts);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result.data));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'server_error', message: err.message }));
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    localServerlessApiPlugin()
  ],
  server: {
    port: 5173,
    host: true
  }
});
