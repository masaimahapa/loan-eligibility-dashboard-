import { FormField } from './components/FormField';
import { ResultsPanel } from './components/ResultsPanel';
import { useEligibilityForm } from './hooks/useEligibilityForm';
import {
  AppShell,
  ContentGrid,
  ErrorMessage,
  FormCard,
  PageHeader,
  PrimaryButton,
  TwoCol
} from './styles/styled';

function formatPurposeLabel(value: string): string {
  return value
    .split('_')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}

export default function App(): JSX.Element {
  const {
    formData,
    errors,
    products,
    result,
    loading,
    pageLoading,
    selectedProduct,
    updateField,
    handleSubmit
  } = useEligibilityForm();

  if (pageLoading) {
    return (
      <AppShell>
        <p>Loading simulator...</p>
      </AppShell>
    );
  }

  if (!selectedProduct) {
    return (
      <AppShell>
        <FormCard as="section">
          <h2>Unable to load loan products</h2>
          <p>{errors.form || 'Try reloading the page.'}</p>
        </FormCard>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader>
        <h1>Loan Eligibility Simulator</h1>
        <p>Check estimated approval, affordability, and repayment details.</p>
      </PageHeader>

      <ContentGrid>
        <FormCard onSubmit={handleSubmit} noValidate>
          <h2>Applicant profile</h2>

          <FormField id="productId" label="Loan product">
            <select
              id="productId"
              value={formData.loanDetails.productId}
              onChange={(event) => updateField('loanDetails.productId', event.target.value)}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
          </FormField>

          <TwoCol>
            <FormField id="age" label="Age" error={errors.age}>
              <input
                id="age"
                type="number"
                min={18}
                max={65}
                value={formData.personalInfo.age}
                onChange={(event) => updateField('personalInfo.age', event.target.value)}
              />
            </FormField>

            <FormField id="employmentStatus" label="Employment status" error={errors.employmentStatus}>
              <select
                id="employmentStatus"
                value={formData.personalInfo.employmentStatus}
                onChange={(event) => updateField('personalInfo.employmentStatus', event.target.value)}
              >
                <option value="employed">Employed</option>
                <option value="self_employed">Self-employed</option>
                <option value="unemployed">Unemployed</option>
                <option value="retired">Retired</option>
              </select>
            </FormField>
          </TwoCol>

          <FormField
            id="employmentDuration"
            label="Employment duration (months)"
            error={errors.employmentDuration}
          >
            <input
              id="employmentDuration"
              type="number"
              min={0}
              value={formData.personalInfo.employmentDuration}
              onChange={(event) => updateField('personalInfo.employmentDuration', event.target.value)}
            />
          </FormField>

          <h2>Financial details</h2>

          <TwoCol>
            <FormField id="monthlyIncome" label="Monthly income (R)" error={errors.monthlyIncome}>
              <input
                id="monthlyIncome"
                type="number"
                min={0}
                step="0.01"
                value={formData.financialInfo.monthlyIncome}
                onChange={(event) => updateField('financialInfo.monthlyIncome', event.target.value)}
              />
            </FormField>

            <FormField id="monthlyExpenses" label="Monthly expenses (R)" error={errors.monthlyExpenses}>
              <input
                id="monthlyExpenses"
                type="number"
                min={0}
                step="0.01"
                value={formData.financialInfo.monthlyExpenses}
                onChange={(event) => updateField('financialInfo.monthlyExpenses', event.target.value)}
              />
            </FormField>
          </TwoCol>

          <TwoCol>
            <FormField id="existingDebt" label="Existing debt (R)">
              <input
                id="existingDebt"
                type="number"
                min={0}
                step="0.01"
                value={formData.financialInfo.existingDebt}
                onChange={(event) => updateField('financialInfo.existingDebt', event.target.value)}
              />
            </FormField>

            <FormField id="creditScore" label="Credit score" error={errors.creditScore} hint="300 - 850">
              <input
                id="creditScore"
                type="number"
                min={300}
                max={850}
                value={formData.financialInfo.creditScore}
                onChange={(event) => updateField('financialInfo.creditScore', event.target.value)}
              />
            </FormField>
          </TwoCol>

          <h2>Loan request</h2>

          <TwoCol>
            <FormField
              id="requestedAmount"
              label="Requested amount (R)"
              error={errors.requestedAmount}
              hint={`R${selectedProduct.minAmount.toLocaleString()} - R${selectedProduct.maxAmount.toLocaleString()}`}
            >
              <input
                id="requestedAmount"
                type="number"
                min={selectedProduct.minAmount}
                max={selectedProduct.maxAmount}
                step="0.01"
                value={formData.loanDetails.requestedAmount}
                onChange={(event) => updateField('loanDetails.requestedAmount', event.target.value)}
              />
            </FormField>

            <FormField
              id="loanTerm"
              label="Loan term (months)"
              error={errors.loanTerm}
              hint={`${selectedProduct.minTerm} - ${selectedProduct.maxTerm} months`}
            >
              <input
                id="loanTerm"
                type="number"
                min={selectedProduct.minTerm}
                max={selectedProduct.maxTerm}
                value={formData.loanDetails.loanTerm}
                onChange={(event) => updateField('loanDetails.loanTerm', event.target.value)}
              />
            </FormField>
          </TwoCol>

          <FormField id="loanPurpose" label="Loan purpose">
            <select
              id="loanPurpose"
              value={formData.loanDetails.loanPurpose}
              onChange={(event) => updateField('loanDetails.loanPurpose', event.target.value)}
            >
              {selectedProduct.purposes.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {formatPurposeLabel(purpose)}
                </option>
              ))}
            </select>
          </FormField>

          {errors.form ? <ErrorMessage>{errors.form}</ErrorMessage> : null}

          <PrimaryButton type="submit" disabled={loading}>
            {loading ? 'Evaluating...' : 'Check eligibility'}
          </PrimaryButton>
        </FormCard>

        <ResultsPanel result={result} />
      </ContentGrid>
    </AppShell>
  );
}
