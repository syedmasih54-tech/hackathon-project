/**
 * masking.js
 * Masks sensitive numbers (e.g. Reference numbers, application codes)
 * e.g. "UP2026WID87654321" -> "UP20********4321"
 */

export function maskLongNumber(str, visibleStart = 4, visibleEnd = 4) {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (trimmed.length <= visibleStart + visibleEnd) {
    return trimmed;
  }

  const start = trimmed.slice(0, visibleStart);
  const end = trimmed.slice(-visibleEnd);
  const maskedCount = Math.max(4, trimmed.length - visibleStart - visibleEnd);
  return `${start}${'*'.repeat(maskedCount)}${end}`;
}
