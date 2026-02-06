import styled from 'styled-components';
import { EligibilityResponse } from '../types';
import { BaseCard } from '../styles/styled';

interface ResultsPanelProps {
  result: EligibilityResponse | null;
}

const ResultCard = styled(BaseCard)`
  @media (min-width: 960px) {
    position: sticky;
    top: 1rem;
  }

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }
`;

const EmptyResultCard = styled(ResultCard)`
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--ink-soft);
  min-height: 280px;

  p {
    max-width: 36ch;
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

const StatusBadge = styled.span<{ $approved: boolean }>`
  border-radius: 4px;
  padding: 0.28rem 0.55rem;
  font-size: 0.82rem;
  font-weight: 600;
  background: ${({ $approved }) => ($approved ? '#e8f5ee' : '#fde8eb')};
  color: ${({ $approved }) => ($approved ? 'var(--success)' : 'var(--danger)')};
`;

const MetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.6rem;
  margin-top: 0.85rem;

  @media (min-width: 580px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MetricCard = styled.article`
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.65rem 0.7rem;
  background: #fff;

  h3 {
    font-size: 0.8rem;
    color: var(--ink-soft);
    font-weight: 500;
    letter-spacing: 0;
  }

  strong {
    display: inline-block;
    margin-top: 0.15rem;
    font-size: 0.98rem;
  }
`;

const DecisionReason = styled.p`
  margin-top: 0.85rem;
  color: var(--ink-soft);
  background: #f6f8fa;
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 0.55rem 0.7rem;
  font-size: 0.9rem;
  line-height: 1.4;
`;

const CapitalizedStrong = styled.strong`
  text-transform: capitalize;
`;

const TableWrap = styled.div`
  margin-top: 1rem;

  h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 0.4rem;
  }

  .table-scroll {
    overflow-x: auto;
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  table {
    width: 100%;
    min-width: 560px;
    border-collapse: collapse;
    font-size: 0.84rem;
  }

  thead {
    background: #f6f8fa;
  }

  th,
  td {
    padding: 0.42rem 0.55rem;
    border-bottom: 1px solid #eef1f5;
    text-align: right;
    white-space: nowrap;
  }

  th {
    color: var(--ink-soft);
    font-size: 0.8rem;
    font-weight: 500;
  }

  th:first-child,
  td:first-child {
    text-align: left;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(value);
}

export function ResultsPanel({ result }: ResultsPanelProps): JSX.Element {
  if (!result) {
    return (
      <EmptyResultCard>
        <h2>Eligibility results</h2>
        <p>Submit your details to view estimated approval chance, affordability, and repayments.</p>
      </EmptyResultCard>
    );
  }

  const { eligibilityResult, recommendedLoan, affordabilityAnalysis, paymentSchedule } = result;

  return (
    <ResultCard>
      <ResultHeader>
        <h2>Eligibility results</h2>
        <StatusBadge $approved={eligibilityResult.isEligible}>
          {eligibilityResult.isEligible ? 'Likely Eligible' : 'Needs Improvement'}
        </StatusBadge>
      </ResultHeader>

      <MetricGrid>
        <MetricCard>
          <h3>Approval likelihood</h3>
          <strong>{eligibilityResult.approvalLikelihood}%</strong>
        </MetricCard>
        <MetricCard>
          <h3>Risk category</h3>
          <CapitalizedStrong>{eligibilityResult.riskCategory}</CapitalizedStrong>
        </MetricCard>
        <MetricCard>
          <h3>Affordability score</h3>
          <CapitalizedStrong>{affordabilityAnalysis.affordabilityScore}</CapitalizedStrong>
        </MetricCard>
        <MetricCard>
          <h3>Recommended amount</h3>
          <strong>{formatCurrency(recommendedLoan.recommendedAmount)}</strong>
        </MetricCard>
      </MetricGrid>

      <DecisionReason>{eligibilityResult.decisionReason}</DecisionReason>

      <MetricGrid>
        <MetricCard>
          <h3>Monthly payment</h3>
          <strong>{formatCurrency(recommendedLoan.monthlyPayment)}</strong>
        </MetricCard>
        <MetricCard>
          <h3>Total repayment</h3>
          <strong>{formatCurrency(recommendedLoan.totalRepayment)}</strong>
        </MetricCard>
        <MetricCard>
          <h3>Disposable income</h3>
          <strong>{formatCurrency(affordabilityAnalysis.disposableIncome)}</strong>
        </MetricCard>
        <MetricCard>
          <h3>Debt-to-income</h3>
          <strong>{affordabilityAnalysis.debtToIncomeRatio.toFixed(1)}%</strong>
        </MetricCard>
      </MetricGrid>

      <TableWrap>
        <h3>Repayment schedule (first 6 months)</h3>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Month</th>
                <th>Payment</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Balance</th>
              </tr>
            </thead>
            <tbody>
              {paymentSchedule.slice(0, 6).map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>{formatCurrency(item.payment)}</td>
                  <td>{formatCurrency(item.principal)}</td>
                  <td>{formatCurrency(item.interest)}</td>
                  <td>{formatCurrency(item.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TableWrap>
    </ResultCard>
  );
}
