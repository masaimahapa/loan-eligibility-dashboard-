# Loan Eligibility Simulator

Production-grade frontend take-home submission for the **Frontend Project #2: Loan Eligibility Simulator** brief.

## What this project delivers

- Responsive React + TypeScript UI for capturing applicant and loan inputs.
- Mocked API layer aligned to the provided endpoint specification:
  - `POST /api/loans/eligibility`
  - `GET /api/loans/products`
  - `POST /api/loans/calculate-rate`
  - `GET /api/loans/validation-rules`
- Validation rules and product-specific constraints (amount/term/purpose).
- Simulated eligibility decisioning with affordability and risk outputs.
- Repayment schedule table (first 6 months shown).
- Automated unit tests for finance calculations and validation logic.
- Production Docker image (multi-stage build + nginx static serving).

## Tech stack

- React 18
- TypeScript
- Vite
- styled-components
- Vitest + Testing Library
- ESLint + Prettier
- Docker + Nginx

## Run locally

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Default URL: `http://localhost:5173`

## Build and test

### Run tests

```bash
npm test
```

### Build production assets

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## Docker

### Build image

```bash
docker build -t loan-eligibility-simulator .
```

### Run container

```bash
docker run --rm -p 8080:80 loan-eligibility-simulator
```

App URL: `http://localhost:8080`

Health endpoint: `http://localhost:8080/health`

## Project structure

```text
src/
  api/                # Mock endpoint data + service functions
  components/         # UI components (FormField, ResultsPanel)
  hooks/              # Custom hooks (useEligibilityForm)
  lib/                # Validation and finance logic
  __tests__/          # Unit + component tests
  styles/             # Styled-components definitions
```

## Notes on assessment scope

- This submission uses mocked endpoint behavior (no backend), matching the brief’s mocked-data expectation.
- Business logic is intentionally isolated (`src/lib`) for easier migration to real APIs.

