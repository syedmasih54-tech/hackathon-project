/**
 * geminiService.js
 * Server-side Gemini API client for BenefitBridge.
 * 
 * STRICT PRIVACY RULES:
 * 1. The GEMINI_API_KEY lives strictly in environment variables, NEVER client-side.
 * 2. Request bodies, base64 images, and personal documents are NEVER logged.
 * 3. Document images are processed in memory and never stored on disk or database.
 * 4. OCR returns ONLY {"name": "...", "confidence": 0-1}. No ID numbers or personal details are extracted.
 * 5. Complaint drafting uses ONLY provided structured facts with strict limits.
 */

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];

/**
 * Extracts beneficiary name from document image using Gemini Vision
 */
export async function processDocumentOcr(imageBase64, mimeType = 'image/jpeg') {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: 'api_key_missing',
      message: 'GEMINI_API_KEY is not configured on the server. Please enter the name manually.'
    };
  }

  // Strip prefix if data URL format (e.g. data:image/jpeg;base64,...)
  let cleanBase64 = imageBase64;
  let cleanMime = mimeType;
  if (imageBase64.includes(';base64,')) {
    const parts = imageBase64.split(';base64,');
    cleanMime = parts[0].replace('data:', '') || mimeType;
    cleanBase64 = parts[1];
  }

  const prompt = `You are an automated document assistant for Indian welfare beneficiaries.
Analyze this official document (such as a Ration Card or Bank Passbook).
Extract ONLY the primary beneficiary / account holder name.
Return STRICTLY valid JSON with this exact schema:
{"name": "Full Name", "confidence": 0.95}

CRITICAL PRIVACY & SECURITY RULES:
- Do NOT extract or return any Aadhaar numbers, ration card numbers, bank account numbers, IFSC codes, mobile numbers, or addresses.
- If the name is written in Hindi (Devanagari) or English, preserve it or provide the most legible format.
- If no beneficiary name is found or legible, return: {"name": "", "confidence": 0.0}
- Do NOT include any explanations or markdown outside the JSON object.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inline_data: {
              mime_type: cleanMime,
              data: cleanBase64
            }
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.1,
      response_mime_type: "application/json"
    }
  };

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastError = new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 150)}`);
        continue;
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

      // Parse JSON safely
      let parsed = {};
      try {
        parsed = JSON.parse(rawText);
      } catch (e) {
        // Fallback regex extract
        const match = rawText.match(/\{[\s\S]*\}/);
        if (match) parsed = JSON.parse(match[0]);
      }

      const extractedName = (parsed.name || '').trim();
      const confidence = typeof parsed.confidence === 'number' ? Math.min(1, Math.max(0, parsed.confidence)) : 0.8;

      return {
        success: true,
        data: {
          name: extractedName,
          confidence: extractedName ? confidence : 0
        }
      };
    } catch (err) {
      lastError = err;
    }
  }

  return {
    success: false,
    error: 'ocr_failed',
    message: 'Could not extract name from image. Please enter the name manually.',
    detail: lastError ? lastError.message : 'Unknown error'
  };
}

/**
 * Drafts a polite complaint strictly adhering to prompt instructions:
 * "Use ONLY the JSON facts provided. Do not decide eligibility. Do not invent documents, deadlines,
 * laws, or government rules. Do not claim fraud. Write a polite complaint in simple Hindi,
 * maximum 120 words. If information is missing, say it is missing."
 */
export async function draftGrievanceComplaint(facts) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    // Generate deterministic local fallback complaint if API key is not configured
    return {
      success: true,
      data: {
        draft: generateDeterministicComplaint(facts),
        isFallback: true
      }
    };
  }

  const structuredFactsJson = JSON.stringify({
    scheme: facts.scheme || 'Indira Gandhi National Widow Pension Scheme (IGNWPS)',
    application_date: facts.application_date || 'अज्ञात / Not provided',
    days_elapsed: facts.days_elapsed || 0,
    reference_number: facts.reference_number || 'उपलब्ध नहीं / Not available',
    issue: facts.issue || 'आवेदन पर कोई निर्णय या पेंशन राशि प्राप्त नहीं हुई है'
  });

  const prompt = `Use ONLY the JSON facts provided below. Do not decide eligibility. Do not invent documents, deadlines, laws, or government rules. Do not claim fraud. Write a polite complaint in simple Hindi, maximum 120 words. If information is missing, say it is missing.

JSON Facts:
${structuredFactsJson}`;

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 250
    }
  };

  let lastError = null;

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        lastError = new Error(`Gemini API error (${response.status})`);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      if (text) {
        return {
          success: true,
          data: {
            draft: text.trim(),
            isFallback: false
          }
        };
      }
    } catch (err) {
      lastError = err;
    }
  }

  // Graceful deterministic fallback
  return {
    success: true,
    data: {
      draft: generateDeterministicComplaint(facts),
      isFallback: true,
      note: 'Generated using local template due to service timeout'
    }
  };
}

/**
 * Deterministic template adhering to strict constraint rules
 */
function generateDeterministicComplaint(facts) {
  const scheme = facts.scheme || 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना';
  const appDate = facts.application_date || 'दिनांक अनुपलब्ध';
  const days = facts.days_elapsed || 'कई';
  const ref = facts.reference_number || 'संख्या अनुपलब्ध';
  const issue = facts.issue || 'पेंशन भुगतान में विलंब';

  return `सेवा में,
सक्षम अधिकारी महोदय,

सादर निवेदन है कि मैंने ${scheme} के अंतर्गत आवेदन किया था। आवेदन की तिथि ${appDate} है और संदर्भ संख्या ${ref} है। अब तक लगभग ${days} दिन बीत चुके हैं, परंतु मुझे पेंशन या आवेदन की स्थिति की कोई सूचना प्राप्त नहीं हुई है।

समस्या: ${issue}।

कृपया मेरे आवेदन की स्थिति की जांच कर आवश्यक कार्रवाई करने की कृपा करें। यदि किसी अतिरिक्त दस्तावेज़ की आवश्यकता हो तो सूचित करें।

धन्यवाद।
प्रार्थी / प्रार्थिनी`;
}

// If executed directly (e.g., node server/geminiService.js or VS Code "Run Code" button)
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))) {
  console.log('====================================================');
  console.log(' BenefitBridge - Gemini Service Module');
  console.log('====================================================');
  console.log('Notice: This file is a backend service module used by Vite.');
  console.log('API Key Status:', process.env.GEMINI_API_KEY ? 'Configured' : 'Not set (using offline deterministic fallbacks)');
  console.log('\n--- Self-Test: Deterministic Complaint Draft ---');
  console.log(generateDeterministicComplaint({
    scheme: 'इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना',
    application_date: '2026-01-15',
    days_elapsed: 52,
    reference_number: 'UP2026-10293',
    issue: 'पेंशन स्वीकृति के बाद भी DBT खाता में राशि अप्राप्त'
  }));
  console.log('----------------------------------------------------');
  console.log('To run the interactive web app, use:');
  console.log('  npm run dev');
  console.log('Then open: http://localhost:5173\n');
}

