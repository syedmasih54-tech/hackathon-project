import { describe, it, expect } from 'vitest';
import {
  compareBeneficiaryNames,
  transliterateDevanagari,
  tokenizeName,
  stringSimilarity
} from './nameMatcher.js';

describe('Beneficiary Name Matching Engine', () => {
  it('correctly matches initials: "Sunita Devi" vs "Sunita D."', () => {
    const result = compareBeneficiaryNames('Sunita Devi', 'Sunita D.');
    expect(result.match).toBe(true);
    expect(result.status).toBe('matched');
  });

  it('correctly handles Devanagari transliteration: "सुनीता देवी" vs "Sunita Devi"', () => {
    const result = compareBeneficiaryNames('सुनीता देवी', 'Sunita Devi');
    expect(result.match).toBe(true);
    expect(result.status).toBe('matched');
  });

  it('correctly identifies clearly different names: "Sunita Devi" vs "Geeta Sharma"', () => {
    const result = compareBeneficiaryNames('Sunita Devi', 'Geeta Sharma');
    expect(result.match).toBe(false);
    expect(result.status).toBe('difference_found');
    // Critical: Must say "Possible name difference found", NEVER use the word fraud!
    expect(result.message_en).toContain('Possible name difference found');
    expect(result.message_en).not.toMatch(/fraud/i);
    expect(result.message_hi).not.toMatch(/धोखा/i);
  });

  it('ignores honorifics: "Smt. Sunita Devi" vs "Sunita Devi"', () => {
    const result = compareBeneficiaryNames('Smt. Sunita Devi', 'Sunita Devi');
    expect(result.match).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.75);
  });

  it('handles minor spelling phonetic differences: "Suneeta Devi" vs "Sunita Devi"', () => {
    const result = compareBeneficiaryNames('Suneeta Devi', 'Sunita Devi');
    expect(result.match).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0.75);
  });

  it('handles whitespace and casing gracefully', () => {
    const result = compareBeneficiaryNames('  SUNITA   DEVI  ', 'sunita devi');
    expect(result.match).toBe(true);
    expect(result.score).toBe(1.0);
  });
});
