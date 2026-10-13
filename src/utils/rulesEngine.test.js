import { describe, it, expect } from 'vitest';
import { evaluateRules } from './rulesEngine.js';
import widowRules from '../../public/data/rules/widow-pension.json';
import pmKisanRules from '../../public/data/rules/pm-kisan.json';
import scholarshipRules from '../../public/data/rules/post-matric-scholarship.json';

describe('Deterministic Rules Engine - Multi-Scheme Support', () => {
  // Scheme 1: Widow Pension
  describe('Widow Pension Scheme (IGNWPS)', () => {
    it('identifies unverified rules and includes NSAP source metadata', () => {
      const result = evaluateRules(widowRules, { age: 45, marital_status: 'widowed', ration_card_type: 'BPL', has_bank_account: true });
      expect(result.isVerified).toBe(false);
      expect(result.verificationWarning_en).toContain('Warning: These rules are not yet verified');
      expect(result.sourceUrl).toBe('https://nsap.nic.in');
      expect(result.lastVerified).toBe('2026-10-01');
    });

    it('reports "You may be eligible" when all criteria are met - NEVER "approved"', () => {
      const user = {
        age: 48,
        marital_status: 'widowed',
        ration_card_type: 'BPL',
        has_bank_account: true
      };
      const nameMatch = { match: true, score: 1.0 };
      const result = evaluateRules(widowRules, user, nameMatch);

      expect(result.isPotentiallyEligible).toBe(true);
      expect(result.statusText_en).toBe('You may be eligible');
      expect(result.statusText_en).not.toMatch(/approved/i);
      expect(result.matchedRules.length).toBe(4);
      expect(result.missingRules.length).toBe(0);
      expect(result.readinessPercentage).toBe(100);
    });

    it('correctly categorizes missing criteria and reflects in checklist', () => {
      const user = {
        age: 25,
        marital_status: 'married',
        ration_card_type: 'OTHER',
        has_bank_account: false
      };
      const result = evaluateRules(widowRules, user, { match: false });

      expect(result.isPotentiallyEligible).toBe(false);
      expect(result.statusText_en).toBe('Some criteria are currently unmet');
      expect(result.missingRules.length).toBe(4);
      expect(result.readinessPercentage).toBe(0);

      const ageCheck = result.checklist.find(c => c.id === 'check_age');
      expect(ageCheck.satisfied).toBe(false);
      expect(ageCheck.next_step_en).toContain('40+');
    });
  });

  // Scheme 2: PM-KISAN (Farmers)
  describe('PM-KISAN Farmers Scheme', () => {
    it('evaluates eligible farmer holding cultivable land', () => {
      const farmerUser = {
        age: 38,
        owns_cultivable_land: true,
        is_taxpayer_excluded: false,
        has_bank_account: true
      };
      const nameMatch = { match: true, score: 0.95 };
      const result = evaluateRules(pmKisanRules, farmerUser, nameMatch);

      expect(result.isPotentiallyEligible).toBe(true);
      expect(result.statusText_en).toBe('You may be eligible');
      expect(result.matchedRules.length).toBe(4);
      expect(result.missingRules.length).toBe(0);
      expect(result.readinessPercentage).toBe(100);
      expect(result.sourceUrl).toBe('https://pmkisan.gov.in');
    });

    it('identifies ineligible farmer who is a taxpayer or has no land', () => {
      const ineligibleUser = {
        age: 45,
        owns_cultivable_land: false,
        is_taxpayer_excluded: true, // Ineligible
        has_bank_account: true
      };
      const result = evaluateRules(pmKisanRules, ineligibleUser, { match: false });

      expect(result.isPotentiallyEligible).toBe(false);
      expect(result.missingRules.length).toBe(2);
      expect(result.readinessPercentage).toBe(40); // 2 of 5 satisfied (age and bank account)
      const landCheck = result.checklist.find(c => c.id === 'check_farmer_land');
      expect(landCheck.satisfied).toBe(false);
      expect(landCheck.next_step_en).toContain('Khasra/Khatoni');
    });
  });

  // Scheme 3: Post-Matric Scholarship (Students)
  describe('Post-Matric Scholarship Scheme', () => {
    it('evaluates eligible student with valid enrollment, income and marks', () => {
      const studentUser = {
        age: 20,
        is_enrolled_student: true,
        family_income: 150000, // Under 2.5L limit
        previous_marks_percentage: 72, // Above 50%
        has_bank_account: true
      };
      const nameMatch = { match: true, score: 1.0 };
      const result = evaluateRules(scholarshipRules, studentUser, nameMatch);

      expect(result.isPotentiallyEligible).toBe(true);
      expect(result.statusText_en).toBe('You may be eligible');
      expect(result.matchedRules.length).toBe(4);
      expect(result.missingRules.length).toBe(0);
      expect(result.readinessPercentage).toBe(100);
      expect(result.sourceUrl).toBe('https://scholarships.gov.in');
    });

    it('identifies student with income exceeding ceiling or low marks', () => {
      const studentUser = {
        age: 19,
        is_enrolled_student: true,
        family_income: 450000, // Exceeds 2.5L limit
        previous_marks_percentage: 42, // Below 50% threshold
        has_bank_account: false
      };
      const result = evaluateRules(scholarshipRules, studentUser, { match: false });

      expect(result.isPotentiallyEligible).toBe(false);
      expect(result.missingRules.length).toBe(3);
      const incomeCheck = result.checklist.find(c => c.id === 'check_student_income');
      expect(incomeCheck.satisfied).toBe(false);
      expect(incomeCheck.next_step_en).toContain('₹2.50 Lakh');
    });
  });
});
