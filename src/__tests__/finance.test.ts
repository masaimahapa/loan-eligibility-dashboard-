import { describe, expect, it } from 'vitest';
import { buildPaymentSchedule, calculateMonthlyPayment, deriveAffordabilityScore } from '../lib/finance';

describe('finance calculations', () => {
  it('calculates monthly payment for amortized loans', () => {
    const payment = calculateMonthlyPayment(150000, 12.5, 24);
    expect(payment).toBeGreaterThan(7000);
    expect(payment).toBeLessThan(7200);
  });

  it('builds a full payment schedule with decreasing balance', () => {
    const schedule = buildPaymentSchedule(50000, 10, 12);
    expect(schedule).toHaveLength(12);
    expect(schedule[0].balance).toBeGreaterThan(schedule[11].balance);
    expect(schedule[11].balance).toBeCloseTo(0, 0);
  });

  it('derives affordability scores from disposable income ratio', () => {
    expect(deriveAffordabilityScore(12000, 4000)).toBe('excellent');
    expect(deriveAffordabilityScore(6000, 4000)).toBe('good');
    expect(deriveAffordabilityScore(4000, 4000)).toBe('fair');
    expect(deriveAffordabilityScore(3500, 4000)).toBe('poor');
  });
});
