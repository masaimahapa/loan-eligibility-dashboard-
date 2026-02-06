import { loanProducts, validationRules } from './mockData';
import {
  EligibilityRequest,
  EligibilityResponse,
  InterestRateResponse,
  LoanProduct,
  ValidationRules
} from '../types';
import {
  buildPaymentSchedule,
  calculateDebtToIncomeRatio,
  calculateMonthlyPayment,
  clamp,
  deriveAffordabilityScore,
  roundCurrency
} from '../lib/finance';

function delay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function getLoanProducts(): Promise<{ products: LoanProduct[] }> {
  await delay();
  return { products: loanProducts };
}

export async function getValidationRules(): Promise<ValidationRules> {
  await delay(120);
  return validationRules;
}

export async function calculateInterestRate(input: {
  loanAmount: number;
  loanTerm: number;
  creditScore: number;
  loanType: string;
}): Promise<InterestRateResponse> {
  await delay(200);
  const product = loanProducts.find((item) => item.id === input.loanType);
  if (!product) {
    throw new Error('Unknown loan type');
  }

  const scoreFactor = clamp((720 - input.creditScore) / 420, 0, 1);
  const baseRate =
    product.interestRateRange.min +
    (product.interestRateRange.max - product.interestRateRange.min) * scoreFactor;

  const termPenalty = clamp((input.loanTerm - product.minTerm) / 84, 0, 0.8);
  const interestRate = roundCurrency(baseRate + termPenalty);

  const monthlyPayment = roundCurrency(
    calculateMonthlyPayment(input.loanAmount, interestRate, input.loanTerm)
  );
  const totalRepayment = roundCurrency(monthlyPayment * input.loanTerm);
  const totalInterest = roundCurrency(totalRepayment - input.loanAmount);
  const paymentSchedule = buildPaymentSchedule(input.loanAmount, interestRate, input.loanTerm);

  return {
    interestRate,
    monthlyPayment,
    totalInterest,
    totalRepayment,
    paymentSchedule
  };
}

export async function checkLoanEligibility(
  payload: EligibilityRequest
): Promise<EligibilityResponse> {
  const rateResponse = await calculateInterestRate({
    loanAmount: payload.loanDetails.requestedAmount,
    loanTerm: payload.loanDetails.loanTerm,
    creditScore: payload.financialInfo.creditScore,
    loanType: payload.loanDetails.productId
  });

  const disposableIncome = payload.financialInfo.monthlyIncome - payload.financialInfo.monthlyExpenses;
  const debtToIncomeRatio = calculateDebtToIncomeRatio(
    payload.financialInfo.existingDebt,
    payload.financialInfo.monthlyIncome
  );
  const loanToIncomeRatio =
    (payload.loanDetails.requestedAmount / (payload.financialInfo.monthlyIncome * 12)) * 100;

  const affordabilityScore = deriveAffordabilityScore(disposableIncome, rateResponse.monthlyPayment);
  const hasStrongCredit = payload.financialInfo.creditScore >= 650;
  const hasGoodCashflow = disposableIncome >= rateResponse.monthlyPayment * 1.3;
  const manageableDebt = debtToIncomeRatio <= 35;

  const approvalLikelihood = clamp(
    Math.round(
      40 +
        (hasStrongCredit ? 25 : 8) +
        (hasGoodCashflow ? 25 : 6) +
        (manageableDebt ? 10 : 0) -
        (payload.personalInfo.employmentStatus === 'unemployed' ? 35 : 0)
    ),
    5,
    98
  );

  const isEligible =
    approvalLikelihood >= 60 &&
    payload.personalInfo.employmentDuration >= 3 &&
    payload.personalInfo.age >= 18 &&
    payload.personalInfo.age <= 65;

  const riskCategory =
    approvalLikelihood >= 80 ? 'low' : approvalLikelihood >= 60 ? 'medium' : 'high';

  const decisionReason = isEligible
    ? 'Income-to-expense ratio and debt level support this request'
    : 'Current affordability profile or risk score is below our simulated threshold';

  const recommendedAmount = isEligible
    ? payload.loanDetails.requestedAmount
    : roundCurrency(payload.loanDetails.requestedAmount * 0.7);

  const product = loanProducts.find((item) => item.id === payload.loanDetails.productId);
  const productMax = product?.maxAmount ?? 300000;

  return {
    eligibilityResult: {
      isEligible,
      approvalLikelihood,
      riskCategory,
      decisionReason
    },
    recommendedLoan: {
      maxAmount: Math.min(productMax, roundCurrency(payload.financialInfo.monthlyIncome * 24)),
      recommendedAmount,
      interestRate: rateResponse.interestRate,
      monthlyPayment: rateResponse.monthlyPayment,
      totalRepayment: rateResponse.totalRepayment
    },
    affordabilityAnalysis: {
      disposableIncome: roundCurrency(disposableIncome),
      debtToIncomeRatio: roundCurrency(debtToIncomeRatio),
      loanToIncomeRatio: roundCurrency(loanToIncomeRatio),
      affordabilityScore
    },
    paymentSchedule: rateResponse.paymentSchedule
  };
}
