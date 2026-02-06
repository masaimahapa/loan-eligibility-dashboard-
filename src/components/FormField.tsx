import { Children, cloneElement, isValidElement, ReactNode } from 'react';
import styled from 'styled-components';
import { ErrorMessage } from '../styles/styled';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  hint?: string;
}

const Field = styled.div`
  margin-bottom: 0.95rem;

  label {
    display: inline-block;
    margin-bottom: 0.28rem;
    font-size: 0.88rem;
    color: var(--ink-soft);
    font-weight: 500;
  }
`;

const Hint = styled.small`
  color: var(--ink-soft);
  font-size: 0.8rem;
  font-weight: 400;
`;

export function FormField({ id, label, error, children, hint }: FormFieldProps): JSX.Element {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const enhanced = Children.map(children, (child) => {
    if (isValidElement<Record<string, unknown>>(child)) {
      return cloneElement(child, {
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy
      });
    }
    return child;
  });

  return (
    <Field>
      <label htmlFor={id}>{label}</label>
      {enhanced}
      {hint ? <Hint id={hintId}>{hint}</Hint> : null}
      {error ? <ErrorMessage id={errorId} role="alert">{error}</ErrorMessage> : null}
    </Field>
  );
}
