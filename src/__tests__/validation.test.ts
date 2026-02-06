import { describe, expect, it } from 'vitest';
import { validationRules } from '../api/mockData';
import { validateEligibilityInput } from '../lib/validation';
import { EligibilityRequest } from '../types';

const validPayload: EligibilityRequest = {
  personalInfo: {
    age: 35,
    employmentStatus: 'employed',
    employmentDuration: 24
  },
  financialInfo: {
    monthlyIncome: 25000,
    monthlyExpenses: 10000,
    existingDebt: 3000,
    creditScore: 680
  },
  loanDetails: {
    productId: 'personal_loan',
    requestedAmount: 120000,
    loanTerm: 24,
    loanPurpose: 'home_improvement'
  }
};

describe('eligibility validation', () => {
  it('returns no errors for valid payload', () => {
    const errors = validateEligibilityInput(validPayload, validationRules, 5000, 300000, 6, 60);
    expect(errors).toEqual({});
  });

  it('flags expense and amount issues', () => {
    const payload: EligibilityRequest = {
      ...validPayload,
      financialInfo: {
        ...validPayload.financialInfo,
        monthlyExpenses: 26000
      },
      loanDetails: {
        ...validPayload.loanDetails,
        requestedAmount: 1000
      }
    };

    const errors = validateEligibilityInput(payload, validationRules, 5000, 300000, 6, 60);
    expect(errors.monthlyExpenses).toContain('lower than monthly income');
    expect(errors.requestedAmount).toContain('between R5');
  });
});
