'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Shield,
  Zap,
  Brain,
  Clock,
  ArrowRight,
  ArrowDown,
  ChevronRight,
  Menu,
  X,
  LogOut,
  Wallet,
  CreditCard,
  Home,
  Activity,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth.js';

export default function HomePage() {
  const reduceMotion = useReducedMotion();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading: authLoading, signOut } = useAuth();
  const [authError, setAuthError] = useState('');

  const handleSignOut = async () => {
    const { error } = await signOut();
    setAuthError(error?.message || '');
  };

  const navItems = [
    { href: '/', label: 'Home', active: true },
    { href: '/about', label: 'About' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#security', label: 'Security' },
  ];

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'The configured machine learning model analyzes your financial profile and returns an eligibility estimate.',
    },
    {
      icon: Zap,
      title: 'Instant Assessment',
      description: 'Get real-time predictions and explanations without waiting in long queues or bank lines.',
    },
    {
      icon: Shield,
      title: 'Explainable Predictions',
      description: 'Understand exactly which factors contributed to your prediction with transparent AI insights.',
    },
    {
      icon: Clock,
      title: 'Data handling',
      description: 'Application details are sent to the configured FastAPI service. This browser tab keeps the current application snapshot and response in sessionStorage for the result report.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Enter Your Details',
      description: 'Fill out a simple application form with your income, employment, and property information.',
    },
    {
      number: '02',
      title: 'AI Analyzes Your Profile',
      description: 'The trained model evaluates the submitted details against patterns learned from its training data.',
    },
    {
      number: '03',
      title: 'Understand Your Result',
      description: 'Receive a clear prediction plus explanation of key factors influencing the decision.',
    },
  ];

  const faqs = [
    {
      question: 'What makes LoanAI different from traditional loan calculators?',
      answer: 'Unlike basic calculators, LoanAI shows contributing factors returned with the model estimate. These insights help explain the output but do not guarantee a lending decision or approval.',
    },
    {
      question: 'Is my financial information secure?',
      answer: 'Application details are sent to the configured FastAPI prediction service. This frontend stores the current application snapshot and response in this browser tab\'s sessionStorage so the result page can display them. No loan-profile database is configured in this project.',
    },
    {
      question: 'How accurate are the predictions?',
      answer: 'The model was trained on historical loan data, but this project does not publish a verified accuracy metric. Predictions are estimates and are not guaranteed loan approvals.',
    },
    {
      question: 'Can I use this on mobile devices?',
      answer: 'Absolutely! The entire platform is fully responsive and works seamlessly on desktop, tablets, and mobile devices.',
    },
  ];

  return (
    <div className="min-h-screen loanai-page-bg text-gray-900 dark:text-gray-100">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center"
              >
                <Brain className="w-5 h-5 text-white" />
              </motion.div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                LoanAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                item.href.startsWith('#') ? (
                  <a
                    key={index}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
                  >
                    {item.label}
                  </Link>
                )
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {authLoading ? (
                <span className="text-sm text-gray-500" role="status">Checking account…</span>
              ) : isAuthenticated ? (
                <>
                  <span className="max-w-40 truncate text-sm text-gray-600 dark:text-gray-300" title={user?.email}>{user?.email}</span>
                  <Button variant="ghost" size="sm" onClick={() => { void handleSignOut(); }} leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button asChild variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <Link href="/login">Login</Link>
                </Button>
              )}
              <Button asChild variant="primary" size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/predict">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="loanai-home-mobile-navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          id="loanai-home-mobile-navigation"
          initial={false}
          animate={isMobileMenuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="px-4 py-4 space-y-4">
            {navItems.map((item, index) => (
              item.href.startsWith('#') ? (
                <a
                  key={index}
                  href={item.href}
                  className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={index}
                  href={item.href}
                  className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            <div className="pt-4 space-y-3">
              {authLoading ? (
                <p role="status" className="px-3 py-2 text-sm text-gray-500">Checking account…</p>
              ) : isAuthenticated ? (
                <>
                  <p className="truncate px-3 py-2 text-sm text-gray-500">{user?.email}</p>
                  <Button variant="ghost" fullWidth onClick={() => { void handleSignOut(); setIsMobileMenuOpen(false); }} leftIcon={<LogOut className="h-4 w-4" aria-hidden="true" />}>
                    Sign out
                  </Button>
                </>
              ) : (
                <Button asChild variant="ghost" fullWidth className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                </Button>
              )}
              <Button asChild variant="primary" fullWidth className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Link href="/predict" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </nav>
      {authError && (
        <div role="alert" className="fixed left-1/2 top-20 z-40 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 shadow-lg">
          {authError}
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-white to-indigo-50/50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight"
            >
              Smarter Loan Decisions,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {' '}Explained by AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              AI-powered loan eligibility prediction with instant analysis and explainable insights. Enter your financial details and receive a comprehensive assessment with factors contributing to your result.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Button
                asChild
                variant="primary"
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/predict">
                  Check Your Eligibility
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                <span>How It Works</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Illustrative assessment workflow; self-contained and presentation-only. */}
            <div className="relative left-1/2 mt-16 w-[calc(100vw-2rem)] max-w-7xl -translate-x-1/2 overflow-hidden">
              <div className="pointer-events-none absolute -left-16 top-20 h-56 w-56 rounded-full bg-blue-400/10 blur-3xl" aria-hidden="true" />
              <div className="pointer-events-none absolute -right-12 bottom-8 h-64 w-64 rounded-full bg-violet-400/10 blur-3xl" aria-hidden="true" />

              <div className="relative mb-8 text-center sm:mb-10">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm dark:border-blue-900/60 dark:bg-gray-900/80 dark:text-blue-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" />
                  How LoanAI works
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl lg:text-4xl">
                  From application to explainable decision
                </h2>
                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base">
                  LoanAI evaluates applicant signals, generates a loan decision, and explains the factors behind it.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-3 shadow-[0_24px_80px_-36px_rgba(30,64,175,0.28)] backdrop-blur sm:p-5 lg:p-7 dark:border-slate-700 dark:bg-slate-900/85">
                <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" aria-hidden="true" />
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-1 sm:mb-6 sm:px-2">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
                    <Activity className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    Assessment workflow
                  </div>
                  <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/70 dark:text-indigo-300">
                    Illustrative analysis
                  </span>
                </div>

                <div className="relative grid grid-cols-1 gap-y-2 xl:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)_2.5rem_minmax(0,2fr)] xl:items-stretch xl:gap-x-2 xl:gap-y-0">
                  {/* Application signal inputs */}
                  <div className="relative z-10 h-full rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)] sm:p-5 dark:border-slate-700 dark:bg-slate-950">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        <CreditCard className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-blue-700 dark:text-blue-300">01 · Input</p>
                        <h3 className="mt-0.5 text-base font-bold text-slate-950 dark:text-white">Application data</h3>
                      </div>
                    </div>
                    <p className="mb-3 text-xs leading-5 text-slate-500 dark:text-slate-400">Applicant signals supplied in the form</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Income', Icon: Wallet },
                        { label: 'Credit history', Icon: Shield },
                        { label: 'Loan amount', Icon: CreditCard },
                        { label: 'Property area', Icon: Home },
                      ].map(({ label, Icon }, index) => (
                        <motion.div
                          key={label}
                          animate={reduceMotion ? undefined : { y: [0, index % 2 ? -2 : 2, 0] }}
                          transition={reduceMotion ? undefined : { duration: 3.4, delay: index * 0.18, repeat: Infinity, ease: 'easeInOut' }}
                          className="flex min-h-12 min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-slate-50 px-2 py-2 text-[10px] font-semibold text-slate-700 sm:text-[11px] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                          <span className="min-w-0 leading-4">{label}</span>
                        </motion.div>
                      ))}
                    </div>
                    <p className="mt-3 text-[10px] leading-4 text-slate-400 dark:text-slate-500">Signal types shown for illustration</p>
                  </div>

                  {/* Animated input-to-engine connector */}
                  <div aria-hidden="true" className="relative z-0 flex h-9 items-center justify-center xl:h-12 xl:self-center">
                    <motion.div
                      animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scaleY: [0.88, 1, 0.88] }}
                      transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute bottom-0 top-0 w-px bg-gradient-to-b from-blue-200 via-indigo-400 to-violet-300 xl:bottom-auto xl:left-0 xl:right-0 xl:top-1/2 xl:h-px xl:w-auto xl:bg-gradient-to-r"
                    />
                    <motion.span
                      animate={reduceMotion ? undefined : { y: [-10, 10, -10], x: [-1, 1, -1], opacity: [0.55, 1, 0.55] }}
                      transition={reduceMotion ? undefined : { duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-1/2 top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.75)] xl:animate-none"
                    />
                    <ArrowDown className="relative z-10 h-4 w-4 text-indigo-500 xl:hidden" />
                    <ArrowRight className="relative z-10 hidden h-4 w-4 bg-white text-indigo-500 xl:block dark:bg-slate-900" />
                  </div>

                  {/* Central model and explanation engine */}
                  <motion.div
                    className="relative z-10 h-full rounded-[1.35rem] bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-500 p-px shadow-[0_18px_44px_-24px_rgba(79,70,229,0.7)]"
                  >
                    <div className="relative h-full overflow-hidden rounded-[calc(1.35rem-1px)] bg-slate-950 p-4 text-white sm:p-5">
                      <motion.div
                        aria-hidden="true"
                        animate={reduceMotion ? undefined : { opacity: [0.13, 0.24, 0.13], scale: [0.95, 1.08, 0.95] }}
                        transition={reduceMotion ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                        className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-blue-500 blur-3xl"
                      />
                      <div className="relative">
                        <div className="mb-5 flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/30 to-violet-500/30 text-blue-200 ring-1 ring-white/10">
                            <Brain className="h-5 w-5" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-blue-200">AI / ML analysis</p>
                            <h3 className="mt-1 text-sm font-bold leading-5 text-white sm:text-base">LoanAI Intelligence Engine</h3>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {[
                            { label: 'ML Prediction', Icon: CheckCircle2 },
                            { label: 'Risk Analysis', Icon: Activity },
                            { label: 'SHAP Explanation', Icon: Sparkles },
                          ].map(({ label, Icon }, index) => (
                            <div key={label} className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.08] bg-white/[0.045] px-3 py-2.5">
                              <span className="flex min-w-0 items-center gap-2 text-[11px] font-medium text-slate-200 sm:text-xs">
                                <Icon className="h-3.5 w-3.5 shrink-0 text-blue-300" aria-hidden="true" />
                                {label}
                              </span>
                              <motion.span
                                animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
                                transition={reduceMotion ? undefined : { duration: 2.4, delay: index * 0.25, repeat: Infinity, ease: 'easeInOut' }}
                                className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.8)]"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-[9px] leading-4 text-slate-400">
                          <Activity className="h-3 w-3 shrink-0 text-indigo-300" aria-hidden="true" />
                          Application signals become an interpretable estimate
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Animated engine-to-output connector */}
                  <div aria-hidden="true" className="relative z-0 flex h-9 items-center justify-center xl:h-12 xl:self-center">
                    <motion.div
                      animate={reduceMotion ? undefined : { opacity: [0.45, 1, 0.45], scaleY: [0.88, 1, 0.88] }}
                      transition={reduceMotion ? undefined : { duration: 2.2, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute bottom-0 top-0 w-px bg-gradient-to-b from-indigo-300 via-violet-400 to-blue-200 xl:bottom-auto xl:left-0 xl:right-0 xl:top-1/2 xl:h-px xl:w-auto xl:bg-gradient-to-r"
                    />
                    <motion.span
                      animate={reduceMotion ? undefined : { y: [-10, 10, -10], x: [-1, 1, -1], opacity: [0.55, 1, 0.55] }}
                      transition={reduceMotion ? undefined : { duration: 2.2, delay: 0.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-1/2 top-1/2 z-10 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500 shadow-[0_0_12px_rgba(139,92,246,0.75)]"
                    />
                    <ArrowDown className="relative z-10 h-4 w-4 text-violet-500 xl:hidden" />
                    <ArrowRight className="relative z-10 hidden h-4 w-4 bg-white text-violet-500 xl:block dark:bg-slate-900" />
                  </div>

                  {/* Example outputs: all displayed values and contribution bars are illustrative. */}
                  <div className="relative z-10 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:h-full xl:gap-3">
                    <div className="min-w-0 rounded-2xl border border-emerald-100 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)] sm:p-5 dark:border-emerald-900/60 dark:bg-slate-950">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">Example prediction</p>
                          <h3 className="mt-1 text-sm font-bold text-slate-950 dark:text-white">Decision</h3>
                        </div>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">Illustrative example</span>
                      </div>
                      <div className="flex items-end justify-between gap-2">
                        <p className="text-xl font-extrabold tracking-tight text-emerald-700 sm:text-2xl dark:text-emerald-300">Approved</p>
                        <span className="mb-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-400">Example output</span>
                      </div>
                      <div className="mt-4 flex items-end justify-between gap-2">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Probability</span>
                        <span className="text-lg font-bold tabular-nums text-slate-950 dark:text-white">79.7%</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" role="img" aria-label="Illustrative probability bar showing 79.7 percent">
                        <motion.div
                          initial={reduceMotion ? false : { width: '0%' }}
                          whileInView={{ width: '79.7%' }}
                          viewport={{ once: true }}
                          transition={reduceMotion ? { duration: 0 } : { duration: 1.1, delay: 0.35, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                        />
                      </div>
                      <p className="mt-2 text-[9px] leading-4 text-slate-400 dark:text-slate-500">Illustrative probability visualization</p>
                    </div>

                    <div className="min-w-0 rounded-2xl border border-indigo-100 bg-white p-4 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)] sm:p-5 dark:border-indigo-900/60 dark:bg-slate-950">
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-indigo-700 dark:text-indigo-300">Why this decision?</p>
                          <h3 className="mt-1 text-sm font-bold text-slate-950 dark:text-white">Feature contribution</h3>
                        </div>
                        <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950 dark:text-indigo-300">Illustrative</span>
                      </div>
                      <div className="space-y-3">
                        {[
                          { label: 'Credit history', direction: 'Supports', width: '84%', positive: true },
                          { label: 'Property area', direction: 'Supports', width: '66%', positive: true },
                          { label: 'Education', direction: 'Supports', width: '48%', positive: true },
                          { label: 'Loan amount', direction: 'Offsets', width: '34%', positive: false },
                        ].map(({ label, direction, width, positive }, index) => (
                          <div key={label}>
                            <div className="mb-1 flex min-w-0 items-center justify-between gap-1 text-[9px] leading-4">
                              <span className="truncate font-semibold text-slate-700 dark:text-slate-200">{label}</span>
                              <span className={`shrink-0 font-medium ${positive ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                                {positive ? '+' : '−'} {direction}
                              </span>
                            </div>
                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
                              <motion.div
                                initial={reduceMotion ? false : { width: '0%' }}
                                whileInView={{ width }}
                                viewport={{ once: true }}
                                transition={reduceMotion ? { duration: 0 } : { duration: 0.8, delay: 0.15 + index * 0.12, ease: 'easeOut' }}
                                className={`h-full rounded-full ${positive ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-rose-400 to-orange-400'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-[9px] leading-4 text-slate-400 dark:text-slate-500">Example factors and bar lengths only</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2 rounded-xl border border-blue-100/80 bg-blue-50/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 dark:border-blue-900/60 dark:bg-blue-950/35">
                  <p className="text-[10px] leading-5 text-slate-600 sm:text-xs dark:text-slate-300">
                    <span className="font-bold text-blue-800 dark:text-blue-300">Illustrative only.</span> Actual predictions use submitted application data on the Predict page; this visualization is not a customer result or lending decision.
                  </p>
                  <span className="shrink-0 text-[9px] font-bold uppercase tracking-[0.12em] text-blue-700 dark:text-blue-300">Example output</span>
                </div>
              </div>

              <p className="mt-6 text-center text-xs font-medium tracking-wide text-slate-600 dark:text-slate-300 sm:mt-7 sm:text-sm">
                One application. One model-driven decision. A transparent explanation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="scroll-mt-20 py-20 px-4 sm:px-6 lg:px-8 bg-transparent dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose LoanAI?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the future of loan assessment with cutting-edge AI technology designed for your financial success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group flex h-full scroll-mt-24"
                >
                  <Card animate={false} className="flex h-full flex-col border border-gray-200 p-6 transition-all duration-300 hover:shadow-xl dark:border-gray-800">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 rounded-xl flex items-center justify-center mb-4 group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      {feature.title}
                    </h3>
                    <p className="flex-1 text-sm text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

            {/* Security & Data Handling Section */}
      <section
        id="security"
        className="scroll-mt-24 bg-gradient-to-b from-white via-blue-50/30 to-white py-20 px-4 sm:px-6 lg:px-8 dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-950"
      >
        <div className="mx-auto max-w-7xl">

          {/* Section heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-300">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Security & Data Handling
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              Built with clear data boundaries
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-600 dark:text-gray-300 sm:text-lg">
              Understand how LoanAI handles authentication, application
              information, prediction requests, and result data.
            </p>
          </motion.div>

          {/* Security architecture cards */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            {/* Authentication */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="group"
            >
              <Card className="h-full min-h-[280px] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950 dark:text-blue-300 dark:group-hover:bg-blue-600">
                  <Shield className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Email verification
                </h3>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  LoanAI uses Supabase Auth for one-time email verification.
                  A password is not required for the sign-in flow.
                </p>
              </Card>
            </motion.div>

            {/* Prediction service */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="group"
            >
              <Card className="h-full min-h-[280px] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors duration-300 group-hover:bg-indigo-600 group-hover:text-white dark:bg-indigo-950 dark:text-indigo-300 dark:group-hover:bg-indigo-600">
                  <Brain className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Prediction service
                </h3>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  Submitted application details are sent to the configured
                  FastAPI prediction service for model inference and explanation.
                </p>
              </Card>
            </motion.div>

            {/* Browser session */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.16 }}
              className="group"
            >
              <Card className="h-full min-h-[280px] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors duration-300 group-hover:bg-violet-600 group-hover:text-white dark:bg-violet-950 dark:text-violet-300 dark:group-hover:bg-violet-600">
                  <Activity className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Browser session
                </h3>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  The current application snapshot and prediction response are
                  kept in this browser tab&apos;s sessionStorage for the result and
                  report flow.
                </p>
              </Card>
            </motion.div>

            {/* Database status */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.24 }}
              className="group"
            >
              <Card className="h-full min-h-[280px] border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-600 group-hover:text-white dark:bg-emerald-950 dark:text-emerald-300 dark:group-hover:bg-emerald-600">
                  <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
                </div>

                <h3 className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                  No loan-profile database
                </h3>

                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  A permanent database for storing loan profiles is not
                  currently configured in this project.
                </p>
              </Card>
            </motion.div>

          </div>

          {/* Architecture flow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="mt-10 overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm dark:border-blue-900/50 dark:bg-gray-900"
          >
            <div className="flex flex-col items-center justify-between gap-4 px-5 py-6 text-center sm:flex-row sm:text-left sm:px-8">

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600 dark:text-blue-400">
                  Current data flow
                </p>

                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Authentication → Application → FastAPI prediction → Result
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold text-blue-700 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Transparent architecture
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="scroll-mt-20 py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get your loan eligibility assessment in three simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  <Card className="p-6 h-full hover:shadow-xl transition-all duration-300">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {step.description}
                    </p>
                  </Card>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-8 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 transform -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explainable AI Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                See How Your Result Is Explained
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                LoanAI doesn&apos;t just give you a prediction — it shows you exactly which factors influenced the model&apos;s decision. Understanding these insights helps you prepare stronger applications for the future.
              </p>
              <div className="mb-8 space-y-3">
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  Positive factors returned for your application
                </p>
                <p className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm font-medium text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100">
                  Negative factors returned for your application
                </p>
              </div>
              <Button
                asChild
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Link href="/predict">
                  See How Your Result Is Explained
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6 dark:from-blue-900/20 dark:to-indigo-900/20 sm:p-8">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900">
                      <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Your assessment report</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Populated from the actual API response</p>
                    </div>
                  </div>
                  <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-200">
                    <li className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />Decision probability and configured threshold</li>
                    <li className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />The application details submitted for this assessment</li>
                    <li className="flex items-start gap-3 rounded-xl bg-gray-50 p-3 dark:bg-gray-900"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />Positive and negative SHAP contributions returned by the service</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
              Ready to Understand Your Loan Eligibility?
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your prediction to receive an eligibility estimate with the factors returned by the model.
            </p>
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Link href="/predict">
                Start Your Prediction
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to know about LoanAI&apos;s prediction service.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {faq.answer}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <Link href="/" aria-label="LoanAI home" className="mb-4 inline-flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                  <Brain className="h-5 w-5 text-white" aria-hidden="true" />
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-xl font-bold text-transparent">LoanAI</span>
              </Link>
              <p className="max-w-sm text-sm text-gray-600 dark:text-gray-300">
                AI-assisted loan eligibility estimates with explanations based on the prediction service response.
              </p>
              <div className="mt-5 flex items-center gap-3" aria-label="Social profiles">
                <a
                  href="https://www.linkedin.com/in/kaustav-ghosh-hazra-27876037b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kaustav Ghosh Hazra on LinkedIn"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.882 20.452H3.791V9h3.091v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.226.792 24 1.771 24h20.451C23.2 24 24 23.226 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/KAUSTAV-GH"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="KAUSTAV-GH on GitHub"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-blue-800 dark:hover:bg-blue-950 dark:hover:text-blue-300"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.88 10.96.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.3-1.68-1.3-1.68-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.21 1.8 1.21 1.05 1.8 2.75 1.28 3.42.98.1-.76.42-1.28.76-1.58-2.55-.29-5.23-1.27-5.23-5.66 0-1.25.45-2.27 1.2-3.07-.12-.29-.52-1.46.11-3.04 0 0 .98-.31 3.2 1.17a11.1 11.1 0 0 1 5.82 0c2.22-1.48 3.2-1.17 3.2-1.17.63 1.58.23 2.75.11 3.04.75.8 1.2 1.82 1.2 3.07 0 4.4-2.68 5.36-5.24 5.65.41.36.77 1.06.77 2.14v3.17c0 .31.21.66.8.55C20.7 21.8 24 17.3 24 12 24 5.65 18.63.5 12 .5z" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Product</h3>
              <ul className="space-y-3 text-sm">
                <li><a href="#features" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">How It Works</a></li>
                <li><a href="#security" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Security</a></li>
                <li><Link href="/predict" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-gray-100">Project</h3>
              <ul className="space-y-3 text-sm">
                <li><Link href="/about" className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">About</Link></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-6 dark:border-gray-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 LoanAI. All rights reserved.</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Predictions are model-generated estimates and are not guaranteed loan approvals.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
