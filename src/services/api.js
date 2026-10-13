/**
 * api.js
 * Client-side caller for serverless Gemini endpoints.
 * Handles graceful fallbacks for manual typing when AI calls fail.
 */

export async function callOcrApi(imageBase64, mimeType = 'image/jpeg') {
  try {
    const response = await fetch('/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ imageBase64, mimeType })
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorJson.error || 'ocr_failed',
        message: errorJson.message || 'AI reading is currently unavailable. Please enter the name manually.'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        name: data.name || '',
        confidence: typeof data.confidence === 'number' ? data.confidence : 0.8
      }
    };
  } catch (err) {
    return {
      success: false,
      error: 'network_error',
      message: 'Network issue or server unavailable. You can enter the name manually below.'
    };
  }
}

export async function callComplaintApi(structuredFacts) {
  try {
    const response = await fetch('/api/complaint', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(structuredFacts)
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorJson.error || 'complaint_failed',
        message: errorJson.message || 'Failed to generate complaint draft.'
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: {
        draft: data.draft || '',
        isFallback: Boolean(data.isFallback)
      }
    };
  } catch (err) {
    return {
      success: false,
      error: 'network_error',
      message: 'Failed to contact AI server.'
    };
  }
}
