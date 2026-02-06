import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --ink: #1a2b3c;
    --ink-soft: #5a6f80;
    --card: #ffffff;
    --accent: #1a6fb5;
    --accent-hover: #155a94;
    --success: #18794e;
    --danger: #c4323e;
    --border: #dde4eb;
    --bg: #f4f6f8;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--ink);
    background: var(--bg);
    -webkit-font-smoothing: antialiased;
  }

  h1,
  h2,
  h3 {
    margin: 0;
    letter-spacing: -0.01em;
  }

  p {
    margin: 0;
  }

  input,
  select,
  button {
    width: 100%;
    border-radius: 6px;
    border: 1px solid var(--border);
    font: inherit;
  }

  input,
  select {
    min-height: 42px;
    padding: 0.5rem 0.65rem;
    background: #fff;
    color: var(--ink);
    font-size: 0.94rem;
  }

  input::placeholder {
    color: #8c9bab;
  }

  input:focus,
  select:focus {
    border-color: var(--accent);
    outline: 2px solid rgba(26, 111, 181, 0.15);
    outline-offset: 1px;
  }
`;

export const AppShell = styled.main`
  max-width: 1140px;
  margin: 0 auto;
  padding: 2rem 1rem 3rem;
`;

export const PageHeader = styled.header`
  margin-bottom: 1.5rem;

  h1 {
    font-size: 1.55rem;
    font-weight: 700;
  }

  p {
    color: var(--ink-soft);
    margin-top: 0.3rem;
    font-size: 0.95rem;
  }
`;

export const ContentGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: start;

  @media (min-width: 960px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const BaseCard = styled.section`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;
`;

export const FormCard = styled.form`
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.25rem;

  h2 {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  h2:not(:first-child) {
    margin-top: 1.25rem;
    padding-top: 0.9rem;
    border-top: 1px solid var(--border);
  }
`;

export const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  @media (min-width: 600px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const PrimaryButton = styled.button`
  margin-top: 0.6rem;
  background: var(--accent);
  color: #fff;
  border: none;
  min-height: 44px;
  padding: 0.7rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease;

  &:hover {
    background: var(--accent-hover);
  }

  &:active {
    background: var(--accent-hover);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  margin-top: 0.25rem;
  color: var(--danger);
  font-size: 0.84rem;
  font-weight: 500;
`;
