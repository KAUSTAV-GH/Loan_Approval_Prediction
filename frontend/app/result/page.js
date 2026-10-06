'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  CircleCheck,
  CircleX,
  Download,
  FileText,
  Info,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { downloadPredictionReport } from '@/lib/api.js';
import { HomeButton } from '@/components/layout/HomeButton.jsx';

const PREDICTION_KEY = 'loan_prediction_result';
const APPLICATION_FIELDS = [
  'Gender', 'Married', 'Dependents', 'Education', 'Self_Employed',
  'ApplicantIncome', 'CoapplicantIncome', 'LoanAmount', 'Loan_Amount_Term',
  'Credit_History', 'Property_Area',
];

const FEATURE_LABELS = {
  ApplicantIncome: 'Applicant income',
  CoapplicantIncome: 'Co-applicant income',
  LoanAmount: 'Loan amount',
  Loan_Amount_Term: 'Loan term',
  Credit_History: 'Credit history',
  Property_Area: 'Property area',
  Self_Employed: 'Self-employed',
};

const APPLICATION_LABELS = [
  ['Gender', 'Gender'],
  ['Married', 'Marital status'],
  ['Dependents', 'Dependents'],
  ['Education', 'Education'],
  ['Self_Employed', 'Self-employed'],
  ['ApplicantIncome', 'Applicant income'],
  ['CoapplicantIncome', 'Co-applicant income'],
  ['LoanAmount', 'Loan amount'],
  ['Loan_Amount_Term', 'Loan term'],
  ['Credit_History', 'Credit history'],
  ['Property_Area', 'Property area'],
];

function subscribeToPrediction() {
  return () => {};
}

function getPredictionSnapshot() {
  try {
    return window.sessionStorage.getItem(PREDICTION_KEY);
  } catch {
    return null;
  }
}

function getServerPredictionSnapshot() {
  return undefined;
}

function readPrediction(stored) {
  try {
    if (!stored) return null;

    const result = JSON.parse(stored);
    const validPrediction = result?.prediction === 0 || result?.prediction === 1;
    const validDecision = result?.decision === 'Approved' || result?.decision === 'Not Approved';
    const validProbability = typeof result?.probability === 'number'
      && Number.isFinite(result.probability)
      && result.probability >= 0
      && result.probability <= 1;
    const validThreshold = typeof result?.threshold === 'number'
      && Number.isFinite(result.threshold)
      && result.threshold >= 0
      && result.threshold <= 1;
    const validExplanation = Array.isArray(result?.explanation)
      && result.explanation.every((item) => (
        typeof item?.feature === 'string'
        && typeof item?.shap_value === 'number'
        && Number.isFinite(item.shap_value)
      ));

    if ((!validPrediction && !validDecision) || !validProbability || !validThreshold || !validExplanation) {
      return null;
    }

    const hasApplication = APPLICATION_FIELDS.every((field) => (
      Object.prototype.hasOwnProperty.call(result?.application || {}, field)
    ));

    return {
      ...result,
      decision: validDecision ? result.decision : (result.prediction === 1 ? 'Approved' : 'Not Approved'),
      application: hasApplication ? result.application : null,
    };
  } catch {
    return null;
  }
}

function formatPercent(value) {
  return `${(value * 100).toFixed(1)}%`;
}

function formatFeatureName(feature) {
  return FEATURE_LABELS[feature]
    || feature.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/^\w/, (letter) => letter.toUpperCase());
}

function formatApplicationValue(value) {
  return typeof value === 'number' ? value.toLocaleString() : value;
}

function ContributionGroup({ title, subtitle, items, positive }) {
  const Icon = positive ? TrendingUp : TrendingDown;
  const palette = positive
    ? {
      section: 'border-emerald-100 bg-emerald-50/50',
      icon: 'text-emerald-700 ring-emerald-100',
      value: 'text-emerald-700',
      bar: 'bg-emerald-500',
    }
    : {
      section: 'border-rose-100 bg-rose-50/50',
      icon: 'text-rose-700 ring-rose-100',
      value: 'text-rose-700',
      bar: 'bg-rose-500',
    };
  const maxMagnitude = Math.max(...items.map((item) => Math.abs(item.shap_value)), 0);

  return (
    <section className={`rounded-2xl border p-5 sm:p-6 ${palette.section}`}>
      <div className="mb-5 flex items-start gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ${palette.icon}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <p className="mt-1 text-xs leading-5 text-slate-600">{subtitle}</p>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-600">No features were returned in this direction.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const magnitude = Math.abs(item.shap_value);
            const width = maxMagnitude ? `${(magnitude / maxMagnitude) * 100}%` : '0%';

            return (
              <li key={item.feature} className="rounded-xl bg-white/90 px-4 py-3 shadow-sm shadow-slate-900/[0.03]">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-800">{formatFeatureName(item.feature)}</span>
                  <span className={`shrink-0 text-sm font-bold tabular-nums ${palette.value}`}>
                    {item.shap_value > 0 ? '+' : ''}{item.shap_value.toFixed(4)}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    className={`h-full rounded-full ${palette.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 0.75, delay: 0.2, ease: 'easeOut' }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function ResultPage() {
  const storedPrediction = useSyncExternalStore(
    subscribeToPrediction,
    getPredictionSnapshot,
    getServerPredictionSnapshot,
  );
  const prediction = useMemo(() => readPrediction(storedPrediction), [storedPrediction]);
  const isLoaded = storedPrediction !== undefined;
  const [isDownloading, setIsDownloading] = useState(false);
  const [reportError, setReportError] = useState('');

  const positiveFeatures = prediction?.explanation
    .filter((item) => item.shap_value > 0)
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value)) || [];
  const negativeFeatures = prediction?.explanation
    .filter((item) => item.shap_value < 0)
    .sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value)) || [];
  const isApproved = prediction?.decision === 'Approved';

  const handleDownloadReport = async () => {
    if (!prediction?.application) return;

    setIsDownloading(true);
    setReportError('');

    try {
      const predictionResult = {
        prediction: prediction.prediction,
        decision: prediction.decision,
        probability: prediction.probability,
        threshold: prediction.threshold,
        explanation: prediction.explanation,
      };
      const pdf = await downloadPredictionReport({
        application: prediction.application,
        prediction: predictionResult,
      });
      const downloadUrl = URL.createObjectURL(pdf);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'LoanAI_Prediction_Report.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (error) {
      setReportError(error.message || 'The PDF report could not be downloaded. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-48 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8"
      >
        <nav className="mb-9 flex items-center justify-between" aria-label="Result navigation">
          <Link href="/" className="inline-flex items-center gap-2.5 rounded-lg text-sm font-bold text-slate-900 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white shadow-md shadow-blue-200">
              <Brain className="h-5 w-5" aria-hidden="true" />
            </span>
            LoanAI
          </Link>
          <div className="flex items-center gap-2">
            <HomeButton />
            <span className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 sm:inline-flex">
              <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              Session report
            </span>
          </div>
        </nav>

        <motion.header
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> AI assessment report
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Your eligibility assessment</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Review the model result, understand the contributing factors, and download a report of this application.
          </p>
        </motion.header>

        {!isLoaded ? (
          <Card variant="solid" className="text-center text-slate-600">Loading your prediction…</Card>
        ) : !prediction ? (
          <Card variant="solid" className="p-8 text-center sm:p-10">
            <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
              <Info className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">No valid prediction found</h2>
            <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
              Submit an application to create a result report. The latest response is kept in this browser session.
            </p>
            <div className="mt-6">
              <Button asChild variant="primary" className="!bg-none !bg-blue-700 !text-white hover:!bg-blue-800">
                <Link href="/predict">Start a new application</Link>
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <motion.section
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              aria-label="Prediction summary"
            >
              <Card variant="solid" padding="none" className="overflow-hidden !bg-white shadow-xl shadow-slate-200/60 ring-1 ring-slate-200/80">
                <div className={`p-6 sm:p-8 ${isApproved ? 'bg-gradient-to-r from-emerald-700 to-teal-600' : 'bg-gradient-to-r from-rose-700 to-orange-600'}`}>
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white ring-1 ring-white/20">
                        {isApproved
                          ? <CircleCheck className="h-8 w-8" aria-hidden="true" />
                          : <CircleX className="h-8 w-8" aria-hidden="true" />}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-white/75">AI-assisted result</p>
                        <h2 className="mt-0.5 text-3xl font-bold text-white sm:text-4xl">{prediction.decision}</h2>
                      </div>
                    </div>
                    <div className="sm:min-w-44 sm:text-right">
                      <p className="text-sm font-medium text-white/75">Approval probability</p>
                      <p className="mt-1 text-4xl font-bold tabular-nums text-white">{formatPercent(prediction.probability)}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-center">
                  <div>
                    <div className="mb-3 flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-800">Approval probability</span>
                      <span className="font-bold tabular-nums text-slate-950">{formatPercent(prediction.probability)}</span>
                    </div>
                    <div
                      className="relative h-3 overflow-visible rounded-full bg-slate-100 ring-1 ring-slate-200"
                      role="progressbar"
                      aria-label="Approval probability"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(prediction.probability * 100)}
                    >
                      <motion.div
                        className={`h-full rounded-full transition-[width] duration-700 ${isApproved ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-rose-500 to-orange-500'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${prediction.probability * 100}%` }}
                        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                      />
                      <div
                        className="absolute -top-1.5 h-6 w-0.5 bg-slate-900 shadow-[0_0_0_2px_white]"
                        style={{ left: `${prediction.threshold * 100}%` }}
                        title={`Decision threshold: ${formatPercent(prediction.threshold)}`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 flex justify-between text-xs text-slate-500">
                      <span>0%</span>
                      <span className="font-medium text-slate-700">Threshold marker: {formatPercent(prediction.threshold)}</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Decision threshold</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums text-slate-950">{formatPercent(prediction.threshold)}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      {isApproved ? 'The probability met or exceeded the threshold.' : 'The probability was below the threshold.'}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.section>

            {prediction.application && (
              <section className="mt-6" aria-labelledby="application-snapshot-title">
                <Card variant="solid" className="!bg-white shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/80">
                  <div className="mb-5 flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                      <FileText className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h2 id="application-snapshot-title" className="text-lg font-bold text-slate-900">Application snapshot</h2>
                      <p className="text-xs text-slate-500">The details submitted for this prediction</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                    {APPLICATION_LABELS.map(([field, label]) => (
                      <div key={field} className="flex items-baseline justify-between gap-3 border-b border-slate-100 pb-2">
                        <dt className="text-xs text-slate-500">{label}</dt>
                        <dd className="text-right text-sm font-semibold text-slate-800">{formatApplicationValue(prediction.application[field])}</dd>
                      </div>
                    ))}
                  </dl>
                </Card>
              </section>
            )}

            <section className="mt-6" aria-labelledby="factors-title">
              <Card variant="solid" className="!bg-white shadow-lg shadow-slate-200/40 ring-1 ring-slate-200/80">
                <div className="mb-6 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                    <Brain className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 id="factors-title" className="text-xl font-bold text-slate-950">What influenced this result?</h2>
                    <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                      SHAP values describe how each factor moved this model’s score. Positive values push toward approval; negative values push away. The values are model scores, not percentages.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <ContributionGroup
                    title="Positive contributing factors"
                    subtitle="These factors pushed the model toward approval."
                    items={positiveFeatures}
                    positive
                  />
                  <ContributionGroup
                    title="Negative contributing factors"
                    subtitle="These factors pushed the model away from approval."
                    items={negativeFeatures}
                    positive={false}
                  />
                </div>
              </Card>
            </section>

            <section className="mt-6" aria-label="Report actions">
              {reportError && (
                <p role="alert" className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                  {reportError}
                </p>
              )}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button asChild variant="secondary" size="lg" fullWidth leftIcon={<ArrowLeft className="h-4 w-4" />} className="!border-slate-200 !bg-white !text-slate-700 hover:!bg-slate-50">
                  <Link href="/predict" className="sm:w-auto">
                    Back to New Application
                  </Link>
                </Button>
                <div className="sm:w-auto">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    fullWidth
                    disabled={!prediction.application || isDownloading}
                    isLoading={isDownloading}
                    loadingText="Preparing PDF report..."
                    onClick={handleDownloadReport}
                    leftIcon={<Download className="h-5 w-5" aria-hidden="true" />}
                    className="!bg-none !bg-blue-700 !text-white shadow-lg shadow-blue-200 hover:!bg-blue-800 focus-visible:!ring-blue-500"
                  >
                    Download Detailed Report PDF
                  </Button>
                </div>
              </div>
              {!prediction.application && (
                <p className="mt-3 text-right text-xs text-slate-500">
                  This saved prediction predates application snapshots. Submit a new application to download a complete report.
                </p>
              )}
              <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
                <p className="text-xs leading-5">
                  <strong className="font-semibold">AI-assisted prediction only.</strong> This estimate is not a guaranteed lending decision, loan offer, or approval. A lending institution makes its own final decision after reviewing your application.
                </p>
              </div>
            </section>
          </>
        )}
      </motion.div>
    </main>
  );
}
