'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowDown,
  Brain,
  CheckCircle2,
  Check,
  FileText,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { usePrediction } from '@/hooks/usePrediction.js';
import { predictLoan } from '@/lib/api.js';
import { LoanForm } from '@/components/form/LoanForm.jsx';
import { HomeButton } from '@/components/layout/HomeButton.jsx';

const ANALYSIS_MIN_VISIBLE_MS = 960;
const ANALYSIS_EXIT_MS = 130;

function AnalysisState({ isComplete, isNavigating, onHome }) {
  const steps = [
    { number: '01', label: 'Validating your application', complete: true },
    { number: '02', label: 'Evaluating credit signals', complete: isComplete },
    { number: '03', label: 'Generating explanation', complete: isComplete },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: isNavigating ? 0 : 1, y: isNavigating ? -8 : 0 }}
      transition={{ duration: isNavigating ? ANALYSIS_EXIT_MS / 1000 : 0.28, ease: 'easeOut' }}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-12"
    >
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <HomeButton onClick={onHome} />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-100/60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl rounded-[2rem] border border-white bg-white/90 p-7 shadow-2xl shadow-blue-900/10 backdrop-blur sm:p-10">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[1.6rem] bg-gradient-to-br from-blue-700 to-indigo-600 text-white shadow-xl shadow-blue-300/50">
          <motion.div
            animate={{ rotate: [0, 4, -4, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Brain className="h-10 w-10" aria-hidden="true" />
          </motion.div>
        </div>

        <div className="text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-blue-800 ring-1 ring-blue-100">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> LoanAI assessment
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {isComplete ? 'Your analysis is ready' : 'Analyzing your application'}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
            {isComplete
              ? 'The API returned your prediction and its SHAP explanation. Opening your report now.'
              : 'Your application has passed form validation and is being assessed by the configured prediction API.'}
          </p>
        </div>

        <ol className="mt-8 space-y-3" aria-label="Assessment status">
          {steps.map((step, index) => {
            const active = !isComplete && index === 1;
            return (
              <li key={step.number} className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${active ? 'border-blue-200 bg-blue-50/80' : 'border-slate-100 bg-slate-50/80'}`}>
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${step.complete ? 'bg-emerald-100 text-emerald-700' : active ? 'bg-blue-100 text-blue-700' : 'bg-white text-slate-400 ring-1 ring-slate-200'}`}>
                  {step.complete
                    ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    : active
                      ? <motion.span className="h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent" animate={{ rotate: 360 }} transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }} aria-hidden="true" />
                      : <span className="text-xs font-bold">{step.number}</span>}
                </span>
                <span className={`text-sm font-semibold ${step.complete ? 'text-slate-700' : active ? 'text-blue-900' : 'text-slate-500'}`}>{step.label}</span>
                {active && <span className="ml-auto text-xs font-medium text-blue-700">In progress</span>}
                {step.complete && <span className="ml-auto text-xs font-medium text-emerald-700">Complete</span>}
              </li>
            );
          })}
        </ol>
        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          The result and explanation appear together when the API response is received; no additional prediction is run for the report.
        </p>
      </div>
    </motion.main>
  );
}

const workflow = [
  { number: '01', label: 'Your application', icon: FileText },
  { number: '02', label: 'Model assessment', icon: Brain },
  { number: '03', label: 'Clear explanation', icon: Check },
];

export default function PredictPage() {
  const [serverError, setServerError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const navigationCancelled = useRef(false);
  const router = useRouter();
  const { submitPrediction, storePrediction, isSubmitting } = usePrediction();

  const handleSubmit = async (formData) => {
    setServerError(null);
    setAnalysisComplete(false);
    setIsNavigating(false);
    setIsAnalyzing(true);
    navigationCancelled.current = false;
    const startedAt = Date.now();

    // Keep the request payload aligned with the existing FastAPI LoanApplication schema.
    const payload = {
      Gender: String(formData.Gender),
      Married: String(formData.Married),
      Dependents: String(formData.Dependents),
      Education: String(formData.Education),
      Self_Employed: String(formData.Self_Employed),
      ApplicantIncome: Number(formData.ApplicantIncome),
      CoapplicantIncome: Number(formData.CoapplicantIncome),
      LoanAmount: Number(formData.LoanAmount),
      Loan_Amount_Term: Number(formData.Loan_Amount_Term),
      Credit_History: Number(formData.Credit_History),
      Property_Area: String(formData.Property_Area),
    };

    try {
      const result = await submitPrediction(predictLoan, payload);
      if (navigationCancelled.current) return;
      // Persist the exact request snapshot alongside the actual API response before the transition delay.
      storePrediction({ ...result, application: payload });
      setAnalysisComplete(true);

      const remainingDisplayTime = ANALYSIS_MIN_VISIBLE_MS - (Date.now() - startedAt);
      if (remainingDisplayTime > 0) {
        await new Promise((resolve) => window.setTimeout(resolve, remainingDisplayTime));
      }
      if (navigationCancelled.current) return;

      setIsNavigating(true);
      await new Promise((resolve) => window.setTimeout(resolve, ANALYSIS_EXIT_MS));
      if (navigationCancelled.current) return;

      router.push('/result');
    } catch (err) {
      setIsAnalyzing(false);
      setIsNavigating(false);
      setServerError(err.message || 'An unexpected error occurred');
    }
  };

  if (isAnalyzing) {
    return (
      <AnalysisState
        isComplete={analysisComplete}
        isNavigating={isNavigating}
        onHome={() => { navigationCancelled.current = true; }}
      />
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute right-[-10rem] top-[35rem] h-80 w-80 rounded-full bg-indigo-100/70 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        <div className="mb-5 flex justify-end">
          <HomeButton />
        </div>
        <motion.header
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="mb-9 grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end"
        >
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800 shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              AI-assisted eligibility review
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-[3.4rem]">
              Understand your loan eligibility, <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">with clarity.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Share a few application details for a model-generated estimate, then review which factors influenced the assessment.
            </p>

            <ol className="mt-7 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3" aria-label="Assessment steps">
              {workflow.map(({ number, label, icon: Icon }) => (
                <li key={number} className="flex items-center gap-3 rounded-2xl border border-white bg-white/75 px-4 py-3 shadow-sm backdrop-blur">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold tracking-[0.14em] text-blue-600">STEP {number}</span>
                    <span className="mt-0.5 block text-sm font-semibold text-slate-800">{label}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <div className="hidden rounded-3xl border border-white/90 bg-white/75 p-5 shadow-lg shadow-blue-900/5 backdrop-blur lg:block">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-200">
                <Brain className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Explainable assessment</p>
                <p className="text-xs text-slate-500">Prediction with contributing factors</p>
              </div>
            </div>
            <div className="my-5 h-px bg-slate-100" />
            <div className="space-y-3 text-sm text-slate-600">
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Clear probability and threshold</p>
              <p className="flex items-center gap-2"><Check className="h-4 w-4 text-emerald-600" /> Positive and negative factors</p>
              <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600" /> Session-based result report</p>
            </div>
            <div className="mt-5 flex items-center gap-2 text-xs font-medium text-blue-700">
              <span>Continue to your application</span><ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
            </div>
          </div>
        </motion.header>

        {serverError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="mb-6 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900 shadow-sm"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div>
              <p className="font-semibold">We couldn’t complete the assessment</p>
              <p className="mt-1 text-sm text-rose-800">{serverError}</p>
              {serverError.includes('Network') && (
                <p className="mt-2 text-xs text-rose-700">
                  Check that the prediction API is running at the configured address (default: http://127.0.0.1:8000), then try again.
                </p>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          id="application-form"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: 'easeOut' }}
        >
          <LoanForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </motion.div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-5 text-slate-500">
          LoanAI provides an AI-assisted estimate for informational purposes only. It is not a credit decision, loan offer, or guarantee of approval.
        </p>
      </div>
    </main>
  );
}
