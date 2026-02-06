import { useEffect, useMemo, useState } from 'react';
import { checkLoanEligibility, getLoanProducts, getValidationRules } from '../api/loanService';
import { validateEligibilityInput } from '../lib/validation';
import {
  EligibilityRequest,
  EligibilityResponse,
  FieldErrors,
  LoanProduct,
  ValidationRules
} from '../types';

const initialFormState: EligibilityRequest = {
  personalInfo: {
    age: 30,
    employmentStatus: 'employed',
    employmentDuration: 24
  },
  financialInfo: {
    monthlyIncome: 25000,
    monthlyExpenses: 12000,
    existingDebt: 3000,
    creditScore: 680
  },
  loanDetails: {
    productId: 'personal_loan',
    requestedAmount: 150000,
    loanTerm: 24,
    loanPurpose: 'home_improvement'
  }
};

export function useEligibilityForm() {
  const [formData, setFormData] = useState<EligibilityRequest>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [rules, setRules] = useState<ValidationRules | null>(null);
  const [result, setResult] = useState<EligibilityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function loadBootstrapData(): Promise<void> {
      try {
        const [productsResponse, validationRules] = await Promise.all([
          getLoanProducts(),
          getValidationRules()
        ]);

        setProducts(productsResponse.products);
        setRules(validationRules);
      } catch (error) {
        setErrors({
          form: error instanceof Error ? error.message : 'Failed to load simulator configuration'
        });
      } finally {
        setPageLoading(false);
      }
    }

    void loadBootstrapData();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === formData.loanDetails.productId),
    [products, formData.loanDetails.productId]
  );

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    setFormData((current) => {
      const hasPurpose = selectedProduct.purposes.includes(current.loanDetails.loanPurpose);
      return {
        ...current,
        loanDetails: {
          ...current.loanDetails,
          requestedAmount: Math.min(
            selectedProduct.maxAmount,
            Math.max(selectedProduct.minAmount, current.loanDetails.requestedAmount)
          ),
          loanTerm: Math.min(
            selectedProduct.maxTerm,
            Math.max(selectedProduct.minTerm, current.loanDetails.loanTerm)
          ),
          loanPurpose: hasPurpose ? current.loanDetails.loanPurpose : selectedProduct.purposes[0]
        }
      };
    });
  }, [selectedProduct]);

  function updateField(path: string, value: string): void {
    const fieldKey = path.includes('.') ? path.split('.')[1] : path;
    setErrors((prev) => ({ ...prev, [fieldKey]: '' }));

    setFormData((current) => {
      if (path.startsWith('personalInfo.')) {
        const key = path.replace('personalInfo.', '') as keyof EligibilityRequest['personalInfo'];
        const parsed = key === 'employmentStatus' ? value : Number(value);
        return {
          ...current,
          personalInfo: {
            ...current.personalInfo,
            [key]: parsed
          }
        };
      }

      if (path.startsWith('financialInfo.')) {
        const key = path.replace('financialInfo.', '') as keyof EligibilityRequest['financialInfo'];
        return {
          ...current,
          financialInfo: {
            ...current.financialInfo,
            [key]: Number(value)
          }
        };
      }

      const key = path.replace('loanDetails.', '') as keyof EligibilityRequest['loanDetails'];
      const parsed = key === 'loanPurpose' || key === 'productId' ? value : Number(value);
      return {
        ...current,
        loanDetails: {
          ...current.loanDetails,
          [key]: parsed
        }
      };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!rules || !selectedProduct) {
      return;
    }

    const validationErrors = validateEligibilityInput(
      formData,
      rules,
      selectedProduct.minAmount,
      selectedProduct.maxAmount,
      selectedProduct.minTerm,
      selectedProduct.maxTerm
    );

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setResult(null);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await checkLoanEligibility(formData);
      setResult(response);
    } catch (error) {
      setResult(null);
      setErrors({ form: error instanceof Error ? error.message : 'Unexpected error while checking eligibility' });
    } finally {
      setLoading(false);
    }
  }

  return {
    formData,
    errors,
    products,
    result,
    loading,
    pageLoading,
    selectedProduct,
    updateField,
    handleSubmit
  };
}
