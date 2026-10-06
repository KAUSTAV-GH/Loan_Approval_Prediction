'use client';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

import { loanApplicationSchema } from '@/lib/validation.js';
import {
  GENDER_OPTIONS,
  MARRIED_OPTIONS,
  DEPENDENTS_OPTIONS,
  EDUCATION_OPTIONS,
  SELF_EMPLOYED_OPTIONS,
  PROPERTY_AREA_OPTIONS,
  CREDIT_HISTORY_OPTIONS,
} from '@/lib/constants.js';
import { Button } from '@/components/ui/Button.jsx';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card.jsx';
import { FormField } from '@/components/form/FormField.jsx';
import { FormSection } from '@/components/form/FormSection.jsx';

const DEFAULT_VALUES = {
  Gender: '',
  Married: '',
  Dependents: '',
  Education: '',
  Self_Employed: '',
  ApplicantIncome: '',
  CoapplicantIncome: '',
  LoanAmount: '',
  Loan_Amount_Term: '',
  Credit_History: '',
  Property_Area: '',
};

export function LoanForm({ onSubmit, isSubmitting = false, className = '' }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loanApplicationSchema),
    mode: 'onChange',
    defaultValues: DEFAULT_VALUES,
  });

  const values = useWatch({ control, defaultValue: DEFAULT_VALUES });
  const completedFields = Object.keys(DEFAULT_VALUES).filter((field) => (
    values[field] !== '' && values[field] !== undefined && !errors[field]
  )).length;
  const completionPercent = Math.round((completedFields / Object.keys(DEFAULT_VALUES).length) * 100);

  const handleFormSubmit = (data) => onSubmit(data);

  return (
    <Card
      variant="glass"
      padding="none"
      className={`overflow-hidden !bg-white shadow-xl shadow-slate-200/60 border border-slate-200/80 ${className}`}
    >
      <CardHeader className="mb-0 bg-gradient-to-br from-slate-50 via-white to-blue-50/80 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Application workspace
            </div>
            <CardTitle className="text-2xl sm:text-3xl !text-slate-950">Your application details</CardTitle>
            <CardDescription className="mt-2 max-w-lg text-sm leading-6 !text-slate-600">
              Share the details below to receive an AI-assisted eligibility estimate with an explanation of the key factors.
            </CardDescription>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm sm:w-56">
            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-600">
              <span>Form completion</span>
              <span className="tabular-nums text-slate-900">{completedFields}/{Object.keys(DEFAULT_VALUES).length}</span>
            </div>
            <div
              className="h-2 overflow-hidden rounded-full bg-slate-100"
              role="progressbar"
              aria-label="Form completion"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={completionPercent}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-[width] duration-300"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-500">Your entries stay in this browser session for the result report.</p>
          </div>
        </div>
      </CardHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
        <div className="space-y-5 p-5 sm:p-8">
          <FormSection
            step="01"
            title="Personal profile"
            description="Basic household and employment details."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <FormField label="Gender" name="Gender" options={GENDER_OPTIONS} register={register} error={errors.Gender} required />
                <p className="mt-2 text-xs leading-5 text-slate-500">
                  The training data includes Male and Female. Other options are accepted by the API but are not separately learned model categories.
                </p>
              </div>
              <FormField label="Married" name="Married" options={MARRIED_OPTIONS} register={register} error={errors.Married} required />
              <FormField label="Dependents" name="Dependents" options={DEPENDENTS_OPTIONS} register={register} error={errors.Dependents} required />
              <FormField label="Education" name="Education" options={EDUCATION_OPTIONS} register={register} error={errors.Education} required />
              <FormField label="Self Employed" name="Self_Employed" options={SELF_EMPLOYED_OPTIONS} register={register} error={errors.Self_Employed} required />
            </div>
          </FormSection>

          <FormSection
            step="02"
            title="Income and loan details"
            description="Financial amounts and the requested repayment term."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Applicant Income" name="ApplicantIncome" type="number" placeholder="Monthly income in currency" register={register} error={errors.ApplicantIncome} required />
              <FormField label="Co-applicant Income" name="CoapplicantIncome" type="number" placeholder="Monthly income in currency" register={register} error={errors.CoapplicantIncome} required />
              <FormField label="Loan Amount" name="LoanAmount" type="number" placeholder="Amount in currency" register={register} error={errors.LoanAmount} required />
              <FormField label="Loan Amount Term" name="Loan_Amount_Term" type="number" placeholder="Term in months" register={register} error={errors.Loan_Amount_Term} required />
            </div>
          </FormSection>

          <FormSection
            step="03"
            title="Credit and property"
            description="Credit history and property location used in the assessment."
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField label="Credit History" name="Credit_History" options={CREDIT_HISTORY_OPTIONS} register={register} error={errors.Credit_History} required />
              <FormField label="Property Area" name="Property_Area" options={PROPERTY_AREA_OPTIONS} register={register} error={errors.Property_Area} required />
            </div>
          </FormSection>

          <div className="border-t border-slate-200 pt-5">
            <div className="flex flex-col-reverse gap-3 sm:flex-row">
              <Button
                type="button"
                variant="ghost"
                size="lg"
                fullWidth
                disabled={isSubmitting}
                onClick={() => reset()}
                leftIcon={<RotateCcw className="h-4 w-4" aria-hidden="true" />}
                className="!bg-none !text-slate-600 hover:!bg-slate-100 hover:!text-slate-900 sm:max-w-44"
              >
                Clear form
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isSubmitting}
                loadingText="Analyzing application..."
                disabled={isSubmitting}
                rightIcon={<ArrowRight className="h-5 w-5" aria-hidden="true" />}
                className="!bg-none !bg-blue-700 !text-white shadow-lg shadow-blue-200 transition-all hover:!bg-blue-800 hover:shadow-xl focus-visible:!ring-blue-500 sm:flex-1"
              >
                Analyze My Application
              </Button>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <p>Your application is sent to the configured prediction API for analysis and retained in this browser session to show your report.</p>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
}
