import { draftGrievanceComplaint } from '../../server/geminiService.js';
import { checkRateLimit } from '../../server/rateLimiter.js';

export async function handler(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'method_not_allowed' })
    };
  }

  const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || '127.0.0.1';
  const rateLimit = checkRateLimit(clientIp);

  if (!rateLimit.allowed) {
    return {
      statusCode: 429,
      body: JSON.stringify({
        error: 'rate_limited',
        message: `Too many requests. Please wait ${rateLimit.resetSeconds} seconds.`
      })
    };
  }

  try {
    const facts = JSON.parse(event.body || '{}');
    const result = await draftGrievanceComplaint(facts);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result.data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'internal_error' })
    };
  }
}
