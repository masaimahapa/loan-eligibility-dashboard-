import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ResultsPanel } from '../components/ResultsPanel';
import { EligibilityResponse } from '../types';

const eligibleResult: EligibilityResponse = {
  eligibilityResult: {
    isEligible: true,
    approvalLikelihood: 85,
    riskCategory: 'low',
    decisionReason: 'Income-to-expense ratio and debt level support this request'
  },
  recommendedLoan: {
    maxAmount: 180000,
    recommendedAmount: 150000,
    interestRate: 12.5,
    monthlyPayment: 7089.5,
    totalRepayment: 170148
  },
  affordabilityAnalysis: {
    disposableIncome: 13000,
    debtToIncomeRatio: 12,
    loanToIncomeRatio: 50,
    affordabilityScore: 'good'
  },
  paymentSchedule: [
    { month: 1, payment: 7089.5, principal: 5527.17, interest: 1562.33, balance: 144472.83 },
    { month: 2, payment: 7089.5, principal: 5584.89, interest: 1504.61, balance: 138887.94 },
    { month: 3, payment: 7089.5, principal: 5643.05, interest: 1446.45, balance: 133244.89 }
  ]
};

const ineligibleResult: EligibilityResponse = {
  ...eligibleResult,
  eligibilityResult: {
    isEligible: false,
    approvalLikelihood: 38,
    riskCategory: 'high',
    decisionReason: 'Current affordability profile is below our simulated threshold'
  }
};

describe('ResultsPanel', () => {
  it('shows empty state when no result is provided', () => {
    render(<ResultsPanel result={null} />);

    expect(screen.getByText('Eligibility results')).toBeInTheDocument();
    expect(screen.getByText(/Submit your details/)).toBeInTheDocument();
  });

  it('displays eligible status and key metrics', () => {
    render(<ResultsPanel result={eligibleResult} />);

    expect(screen.getByText('Likely Eligible')).toBeInTheDocument();
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();
    expect(screen.getByText('good')).toBeInTheDocument();
    expect(screen.getByText(/Income-to-expense ratio/)).toBeInTheDocument();
  });

  it('displays ineligible status', () => {
    render(<ResultsPanel result={ineligibleResult} />);

    expect(screen.getByText('Needs Improvement')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('renders the repayment schedule table', () => {
    render(<ResultsPanel result={eligibleResult} />);

    expect(screen.getByText('Repayment schedule (first 6 months)')).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    // 1 header row + 3 data rows
    expect(rows).toHaveLength(4);
  });

  it('shows debt-to-income ratio', () => {
    render(<ResultsPanel result={eligibleResult} />);

    expect(screen.getByText('12.0%')).toBeInTheDocument();
  });
});
