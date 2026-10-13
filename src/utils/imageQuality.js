/**
 * imageQuality.js
 * Client-side image quality analyzer using HTML5 Canvas.
 * Checks for:
 * 1. Low resolution (too small)
 * 2. Poor lighting (too dark)
 * 3. Blur / motion blur (Laplacian variance approximation)
 * 
 * Runs entirely in the browser before any network call.
 */

export async function checkImageQuality(fileOrDataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const issues = [];
        let isTooSmall = false;
        let isTooDark = false;
        let isBlurry = false;

        const width = img.naturalWidth || img.width;
        const height = img.naturalHeight || img.height;

        // 1. Resolution Check
        if (width < 400 || height < 300) {
          isTooSmall = true;
          issues.push('too_small');
        }

        // Draw downsampled image on canvas for analysis (fast performance)
        const sampleWidth = Math.min(width, 320);
        const sampleHeight = Math.min(height, 240);
        const canvas = document.createElement('canvas');
        canvas.width = sampleWidth;
        canvas.height = sampleHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);

        const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
        const data = imgData.data;

        // 2. Luminance / Darkness Check
        let totalLuminance = 0;
        const totalPixels = sampleWidth * sampleHeight;
        const gray = new Float32Array(totalPixels);

        for (let i = 0, p = 0; i < data.length; i += 4, p++) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          // Standard ITU-R BT.601 luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          totalLuminance += lum;
          gray[p] = lum;
        }

        const avgLuminance = totalLuminance / totalPixels;
        if (avgLuminance < 45) {
          isTooDark = true;
          issues.push('too_dark');
        }

        // 3. Blur / Edge Variance Check (Discrete 3x3 Laplacian approximation)
        let laplacianSum = 0;
        let laplacianSqSum = 0;
        let edgePixelCount = 0;

        for (let y = 1; y < sampleHeight - 1; y++) {
          for (let x = 1; x < sampleWidth - 1; x++) {
            const idx = y * sampleWidth + x;
            // 4-neighborhood Laplacian: -4 * center + up + down + left + right
            const center = gray[idx];
            const up = gray[idx - sampleWidth];
            const down = gray[idx + sampleWidth];
            const left = gray[idx - 1];
            const right = gray[idx + 1];

            const lapVal = Math.abs((up + down + left + right) - (4 * center));
            laplacianSum += lapVal;
            laplacianSqSum += lapVal * lapVal;
            edgePixelCount++;
          }
        }

        const meanLap = laplacianSum / (edgePixelCount || 1);
        const lapVariance = (laplacianSqSum / (edgePixelCount || 1)) - (meanLap * meanLap);

        // Typical variance threshold for text documents
        if (lapVariance < 35) {
          isBlurry = true;
          issues.push('blurry');
        }

        const passesQuality = issues.length === 0;

        let guidance_hi = '';
        let guidance_en = '';

        if (isBlurry) {
          guidance_hi = 'फोटो धुंधली है। कृपया कैमरे को स्थिर रखें और साफ फोटो लें।';
          guidance_en = 'The image is blurry. Please hold camera steady and retake clearly.';
        } else if (isTooDark) {
          guidance_hi = 'फोटो में रोशनी कम है। कृपया पर्याप्त रोशनी में दोबारा फोटो लें।';
          guidance_en = 'The image is too dark. Please take photo in good lighting.';
        } else if (isTooSmall) {
          guidance_hi = 'फोटो का आकार बहुत छोटा है। कृपया दस्तावेज़ के पास से साफ फोटो लें।';
          guidance_en = 'Image resolution is too low. Please capture closer to document.';
        }

        resolve({
          passesQuality,
          issues,
          isTooSmall,
          isTooDark,
          isBlurry,
          avgLuminance: Math.round(avgLuminance),
          lapVariance: Math.round(lapVariance),
          guidance_hi,
          guidance_en
        });
      } catch (err) {
        // Fallback: don't block user if canvas analysis encounters browser restriction
        resolve({
          passesQuality: true,
          issues: [],
          isTooSmall: false,
          isTooDark: false,
          isBlurry: false,
          guidance_hi: '',
          guidance_en: ''
        });
      }
    };

    img.onerror = () => {
      resolve({
        passesQuality: false,
        issues: ['invalid_image'],
        guidance_hi: 'छवि लोड नहीं हो सकी। कृपया दोबारा अपलोड करें।',
        guidance_en: 'Could not load image. Please upload again.'
      });
    };

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => { img.src = e.target.result; };
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
