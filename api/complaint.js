import { draftGrievanceComplaint } from '../server/geminiService.js';
import { checkRateLimit } from '../server/rateLimiter.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method_not_allowed', message: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return res.status(429).json({
      error: 'rate_limited',
      message: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds before retrying.`
    });
  }

  try {
    const facts = req.body || {};
    const result = await draftGrievanceComplaint(facts);

    return res.status(200).json(result.data);
  } catch (err) {
    return res.status(500).json({
      error: 'internal_error',
      message: 'Failed to generate complaint draft.'
    });
  }
}
