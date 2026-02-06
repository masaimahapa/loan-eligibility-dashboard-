import { EligibilityRequest, FieldErrors, ValidationRule, ValidationRules } from '../types';

function validateValue(
  key: string,
  value: number | string,
  rule: ValidationRule,
  errors: FieldErrors
): void {
  if (rule.required && (value === '' || value === undefined || value === null)) {
    errors[key] = rule.errorMessage;
    return;
  }

  if (typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      errors[key] = rule.errorMessage;
      return;
    }
    if (rule.max !== undefined && value > rule.max) {
      errors[key] = rule.errorMessage;
      return;
    }
  }

  if (typeof value === 'string' && rule.options?.length && !rule.options.includes(value)) {
    errors[key] = rule.errorMessage;
  }
}

export function validateEligibilityInput(
  payload: EligibilityRequest,
  rules: ValidationRules,
  minAmount: number,
  maxAmount: number,
  minTerm: number,
  maxTerm: number
): FieldErrors {
  const errors: FieldErrors = {};

  validateValue('age', payload.personalInfo.age, rules.personalInfo.age, errors);
  validateValue(
    'employmentStatus',
    payload.personalInfo.employmentStatus,
    rules.personalInfo.employmentStatus,
    errors
  );
  validateValue(
    'employmentDuration',
    payload.personalInfo.employmentDuration,
    rules.personalInfo.employmentDuration,
    errors
  );

  validateValue(
    'monthlyIncome',
    payload.financialInfo.monthlyIncome,
    rules.financialInfo.monthlyIncome,
    errors
  );
  validateValue(
    'monthlyExpenses',
    payload.financialInfo.monthlyExpenses,
    rules.financialInfo.monthlyExpenses,
    errors
  );
  validateValue(
    'creditScore',
    payload.financialInfo.creditScore,
    rules.financialInfo.creditScore,
    errors
  );

  if (
    payload.loanDetails.requestedAmount < minAmount ||
    payload.loanDetails.requestedAmount > maxAmount
  ) {
    errors.requestedAmount = `Requested amount must be between R${minAmount.toLocaleString()} and R${maxAmount.toLocaleString()}`;
  }

  if (payload.loanDetails.loanTerm < minTerm || payload.loanDetails.loanTerm > maxTerm) {
    errors.loanTerm = `Loan term must be between ${minTerm} and ${maxTerm} months`;
  }

  if (payload.financialInfo.monthlyExpenses >= payload.financialInfo.monthlyIncome) {
    errors.monthlyExpenses = 'Monthly expenses must be lower than monthly income';
  }

  return errors;
}
