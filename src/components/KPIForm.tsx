import { useState } from 'react';
import { AggregationType, KPI } from '@/types/kpi';
import { FormulaBuilder } from './formular-builder/FormulaBuilder';
import { FormulaItemType } from '@/types/formula';
import { FormulaEditorProvider } from './formular-builder/formular-editor/FormulaEditorProvider';

interface FormErrors {
  name?: string;
  formula?: string;
  aggregationType?: string;
  general?: string;
}

interface KPIFormProps {
  initialData?: KPI;
  onSubmit: (
    data: Omit<KPI, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<void>;
}

export function KPIForm({ initialData, onSubmit }: KPIFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    conditioning: initialData?.conditioning || '',
    aggregationType:
      initialData?.aggregationType || ('average' as AggregationType),
  });

  // Fix: Add a type assertion to ensure the formula has the correct type
  const [formula, setFormula] = useState<FormulaItemType | null>(
    initialData?.formula ? (initialData.formula as unknown as FormulaItemType) : null
  );
  const [isValidFormula, setIsValidFormula] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate name
    if (!formData.name || formData.name.trim().length === 0) {
      newErrors.name = 'KPI name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'KPI name must be less than 50 characters';
    }

    // Validate formula
    if (!formula || !isValidFormula) {
      newErrors.formula = 'Please create a valid formula';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!validateForm()) {
        setIsSubmitting(false);
        return;
      }

      if (!formula) {
        setErrors({ formula: 'Please create a valid formula' });
        setIsSubmitting(false);
        return;
      }

      const formulaJson = JSON.stringify(formula);
      await onSubmit({
        name: formData.name,
        conditioning: formulaJson,
        formula: formula,
        aggregationType: formData.aggregationType,
      });
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Something went wrong',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormulaChange = (
    newFormula: FormulaItemType | null,
    valid: boolean
  ) => {
    setFormula(newFormula);
    setIsValidFormula(valid);

    // Clear formula error if it becomes valid
    if (valid && errors.formula) {
      setErrors({ ...errors, formula: undefined });
    }
  };

  // Define aggregation type options
  const aggregationOptions: { value: AggregationType; label: string }[] = [
    { value: 'average', label: 'Average' },
    { value: 'median', label: 'Median' },
    { value: 'sum', label: 'Sum' },
    { value: 'integration', label: 'Integration' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="rounded-md border border-danger/20 bg-danger/5 p-4 text-danger">
          {errors.general}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="text-foreground/80 block text-sm font-medium"
        >
          KPI Name
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) {
              setErrors({ ...errors, name: undefined });
            }
          }}
          className={`mt-1 block w-full rounded-md border ${errors.name ? 'border-danger' : 'border-foreground/10'} focus:border-primary/30 focus:ring-primary/30 bg-background-alt px-3 py-2 text-foreground shadow-subtle focus:outline-none focus:ring-1`}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-danger">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="text-foreground/80 mb-1 block text-sm font-medium">
          Formula Builder
        </label>
        <div
          className={
            errors.formula ? 'rounded-md border border-danger p-1' : ''
          }
        >
          <FormulaEditorProvider
            initialFormula={formula}
            onChange={handleFormulaChange}
          >
            <FormulaBuilder />
          </FormulaEditorProvider>
        </div>
        {errors.formula && (
          <p className="mt-1 text-sm text-danger">{errors.formula}</p>
        )}
      </div>

      <div>
        <label className="text-foreground/80 mb-1 block text-sm font-medium">
          Aggregation
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          {aggregationOptions.map((option) => (
            <label key={option.value} className="flex items-center">
              <input
                type="radio"
                name="aggregationType"
                value={option.value}
                checked={formData.aggregationType === option.value}
                onChange={() =>
                  setFormData({ ...formData, aggregationType: option.value })
                }
                className="sr-only" // Hide the actual radio button
              />
              <span
                className={`cursor-pointer rounded-md px-4 py-2 text-sm font-medium transition-all ${
                  formData.aggregationType === option.value
                    ? 'bg-secondary text-white shadow-md'
                    : 'border-foreground/10 hover:border-primary/30 border bg-background-alt text-foreground hover:bg-background'
                }`}
              >
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="rounded-md bg-primary px-4 py-2 text-white shadow-subtle hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isSubmitting || (!formula && !isValidFormula)}
      >
        {isSubmitting ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
