import { processDocumentOcr } from '../server/geminiService.js';
import { checkRateLimit } from '../server/rateLimiter.js';

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method Not Allowed' });
  }

  // Rate Limiting (by client IP or x-forwarded-for)
  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'rate_limited',
      message: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds before retrying.`
    });
  }

  try {
    const { imageBase64, mimeType } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({ error: 'missing_image', message: 'imageBase64 is required' });
    }

    // Process OCR without logging bodies or images
    const result = await processDocumentOcr(imageBase64, mimeType || 'image/jpeg');

    if (!result.success) {
      return res.status(502).json(result);
    }

    // Returns ONLY {"name": "...", "confidence": 0-1}
    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({
      error: 'internal_error',
      message: 'Server error processing document. Please enter details manually.'
    });
  }
}
