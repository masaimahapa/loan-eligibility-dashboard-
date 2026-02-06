import { PaymentScheduleItem } from '../types';

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function calculateMonthlyPayment(
  principal: number,
  annualInterestRate: number,
  months: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12;
  if (monthlyRate === 0) {
    return principal / months;
  }

  const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, months);
  const denominator = Math.pow(1 + monthlyRate, months) - 1;
  return numerator / denominator;
}

export function buildPaymentSchedule(
  principal: number,
  annualInterestRate: number,
  months: number
): PaymentScheduleItem[] {
  const monthlyRate = annualInterestRate / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualInterestRate, months);
  let balance = principal;
  const schedule: PaymentScheduleItem[] = [];

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPaid);

    schedule.push({
      month,
      payment: roundCurrency(monthlyPayment),
      principal: roundCurrency(principalPaid),
      interest: roundCurrency(interest),
      balance: roundCurrency(balance)
    });
  }

  return schedule;
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function calculateDebtToIncomeRatio(existingDebt: number, monthlyIncome: number): number {
  if (monthlyIncome <= 0) {
    return 100;
  }
  return (existingDebt / monthlyIncome) * 100;
}

export function deriveAffordabilityScore(disposableIncome: number, monthlyPayment: number):
  | 'excellent'
  | 'good'
  | 'fair'
  | 'poor' {
  if (disposableIncome >= monthlyPayment * 2) {
    return 'excellent';
  }
  if (disposableIncome >= monthlyPayment * 1.4) {
    return 'good';
  }
  if (disposableIncome >= monthlyPayment) {
    return 'fair';
  }
  return 'poor';
}
