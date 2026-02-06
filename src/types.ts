export type EmploymentStatus = 'employed' | 'self_employed' | 'unemployed' | 'retired';

export interface EligibilityRequest {
  personalInfo: {
    age: number;
    employmentStatus: EmploymentStatus;
    employmentDuration: number;
  };
  financialInfo: {
    monthlyIncome: number;
    monthlyExpenses: number;
    existingDebt: number;
    creditScore: number;
  };
  loanDetails: {
    productId: string;
    requestedAmount: number;
    loanTerm: number;
    loanPurpose: string;
  };
}

export interface LoanProduct {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number;
  maxTerm: number;
  interestRateRange: {
    min: number;
    max: number;
  };
  purposes: string[];
}

export interface PaymentScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface InterestRateResponse {
  interestRate: number;
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  paymentSchedule: PaymentScheduleItem[];
}

export interface EligibilityResponse {
  eligibilityResult: {
    isEligible: boolean;
    approvalLikelihood: number;
    riskCategory: 'low' | 'medium' | 'high';
    decisionReason: string;
  };
  recommendedLoan: {
    maxAmount: number;
    recommendedAmount: number;
    interestRate: number;
    monthlyPayment: number;
    totalRepayment: number;
  };
  affordabilityAnalysis: {
    disposableIncome: number;
    debtToIncomeRatio: number;
    loanToIncomeRatio: number;
    affordabilityScore: 'excellent' | 'good' | 'fair' | 'poor';
  };
  paymentSchedule: PaymentScheduleItem[];
}

export interface ValidationRule {
  min?: number;
  max?: number;
  required: boolean;
  errorMessage: string;
  options?: string[];
}

export interface ValidationRules {
  personalInfo: {
    age: ValidationRule;
    employmentStatus: ValidationRule;
    employmentDuration: ValidationRule;
  };
  financialInfo: {
    monthlyIncome: ValidationRule;
    monthlyExpenses: ValidationRule;
    creditScore: ValidationRule;
  };
  loanDetails: {
    requestedAmount: ValidationRule;
    loanTerm: ValidationRule;
  };
}

export interface FieldErrors {
  [key: string]: string;
}
