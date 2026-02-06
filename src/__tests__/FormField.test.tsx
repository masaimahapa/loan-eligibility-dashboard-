import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FormField } from '../components/FormField';

describe('FormField', () => {
  it('renders label and child input', () => {
    render(
      <FormField id="age" label="Age">
        <input id="age" type="number" />
      </FormField>
    );

    expect(screen.getByLabelText('Age')).toBeInTheDocument();
  });

  it('shows hint text when provided', () => {
    render(
      <FormField id="score" label="Credit score" hint="Range: 300-850">
        <input id="score" type="number" />
      </FormField>
    );

    expect(screen.getByText('Range: 300-850')).toBeInTheDocument();
    const input = screen.getByLabelText('Credit score');
    expect(input).toHaveAttribute('aria-describedby', 'score-hint');
  });

  it('displays error message and sets aria-invalid', () => {
    render(
      <FormField id="income" label="Monthly income" error="Minimum R5,000 required">
        <input id="income" type="number" />
      </FormField>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Minimum R5,000 required');

    const input = screen.getByLabelText('Monthly income');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'income-error');
  });

  it('combines hint and error in aria-describedby', () => {
    render(
      <FormField id="amount" label="Amount" hint="Min R5,000" error="Too low">
        <input id="amount" type="number" />
      </FormField>
    );

    const input = screen.getByLabelText('Amount');
    expect(input).toHaveAttribute('aria-describedby', 'amount-hint amount-error');
  });

  it('does not set aria attributes when no error or hint', () => {
    render(
      <FormField id="debt" label="Existing debt">
        <input id="debt" type="number" />
      </FormField>
    );

    const input = screen.getByLabelText('Existing debt');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(input).not.toHaveAttribute('aria-describedby');
  });
});
