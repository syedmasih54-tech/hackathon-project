import { describe, it, expect } from 'vitest';
import { maskLongNumber } from './masking.js';

describe('Number Masking Utility', () => {
  it('correctly masks long reference numbers', () => {
    const input = 'UP2026WID87654321';
    const masked = maskLongNumber(input, 4, 4);
    expect(masked).toBe('UP20*********4321');
    expect(masked).not.toContain('8765');
  });

  it('preserves short strings if below threshold length', () => {
    expect(maskLongNumber('12345')).toBe('12345');
    expect(maskLongNumber('')).toBe('');
    expect(maskLongNumber(null)).toBe('');
  });

  it('masks standard 12-digit numbers', () => {
    const masked = maskLongNumber('987654321012', 3, 3);
    expect(masked.startsWith('987')).toBe(true);
    expect(masked.endsWith('012')).toBe(true);
    expect(masked.includes('*')).toBe(true);
  });
});
