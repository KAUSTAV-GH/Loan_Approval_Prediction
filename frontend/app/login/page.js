'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle2,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/Button.jsx';
import { Card } from '@/components/ui/Card.jsx';
import { HomeButton } from '@/components/layout/HomeButton.jsx';
import { useAuth } from '@/hooks/useAuth.js';
import { getSupabaseBrowserClient } from '@/lib/supabase/client.js';
import { isSupabaseConfigured } from '@/lib/supabase/config.js';

function getReturnPath() {
  const requestedPath = new URLSearchParams(window.location.search).get('next');

  return requestedPath === '/result' || requestedPath === '/predict'
    ? requestedPath
    : '/predict';
}

export default function LoginPage() {
  const router = useRouter();

  const {
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [step, setStep] = useState('email');
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const configured = isSupabaseConfigured();

  useEffect(() => {
    if (cooldown <= 0) {
      return undefined;
    }

    const timer = window.setTimeout(
      () => setCooldown((remaining) => remaining - 1),
      1000,
    );

    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!authLoading && isAuthenticated && step === 'email') {
      router.replace(getReturnPath());
    }
  }, [authLoading, isAuthenticated, router, step]);

  const handleSendMagicLink = async (event) => {
    event.preventDefault();

    setError('');
    setNotice('');

    const normalizedEmail = email.trim().toLowerCase();

    if (!configured) {
      setError(
        'Supabase Auth is not configured in this environment. Add the required public project variables to frontend/.env.local and restart Next.js.',
      );
      return;
    }

    if (!normalizedEmail) {
      setError('Enter a valid email address.');
      return;
    }

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setError(
        'Supabase Auth could not be initialized. Check the project URL and publishable key.',
      );
      return;
    }

    setIsSending(true);

    try {
      const returnPath = getReturnPath();

      const redirectUrl =
        `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnPath)}`;

      const { error: requestError } =
        await supabase.auth.signInWithOtp({
          email: normalizedEmail,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectUrl,
          },
        });

      if (requestError) {
        throw requestError;
      }

      setEmail(normalizedEmail);
      setStep('sent');
      setCooldown(60);

      setNotice(
        `A secure sign-in link has been sent to ${normalizedEmail}. Open your email and click "Sign in" to continue.`,
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          'Supabase could not send the sign-in email. Try again shortly.',
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || isSending || !configured || !email) {
      return;
    }

    setError('');
    setNotice('');
    setIsSending(true);

    try {
      const returnPath = getReturnPath();

      const redirectUrl =
        `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnPath)}`;

      const { error: requestError } =
        await getSupabaseBrowserClient().auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectUrl,
          },
        });

      if (requestError) {
        throw requestError;
      }

      setCooldown(60);

      setNotice(
        `A new sign-in link has been sent to ${email}.`,
      );
    } catch (requestError) {
      setError(
        requestError.message ||
          'Supabase could not resend the sign-in link.',
      );
    } finally {
      setIsSending(false);
    }
  };

  const changeEmail = () => {
    setStep('email');
    setError('');
    setNotice('');
    setCooldown(0);
  };

  const isBusy = isSending || authLoading;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/70 px-4 py-16 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950/50 sm:px-6">

      <HomeButton className="absolute left-4 top-4 sm:left-6 sm:top-6" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-indigo-200/50 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="relative w-full max-w-md"
      >

        <div className="mb-7 text-center">

          <Link
            href="/"
            aria-label="LoanAI home"
            className="mb-5 inline-flex items-center gap-2.5"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-600 text-white shadow-lg shadow-blue-200">
              <Brain
                className="h-6 w-6"
                aria-hidden="true"
              />
            </span>

            <span className="bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-2xl font-bold text-transparent">
              LoanAI
            </span>
          </Link>

          <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.13em] text-blue-800 shadow-sm">
            <Sparkles
              className="h-3.5 w-3.5"
              aria-hidden="true"
            />
            Secure email verification
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">
            {step === 'sent'
              ? 'Check your email'
              : 'Sign in to LoanAI'}
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {step === 'sent'
              ? `We sent a secure sign-in link to ${email}.`
              : 'Sign in securely using a passwordless email link.'}
          </p>
        </div>

        <Card
          variant="solid"
          className="!border-white/80 !bg-white/95 p-6 shadow-2xl shadow-blue-950/10 ring-1 ring-slate-200/80 sm:p-8"
        >

          {!configured && (
            <div
              role="status"
              className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950"
            >
              <p className="font-semibold">
                Supabase configuration required
              </p>

              <p className="mt-1 leading-5">
                Set{' '}
                <code>NEXT_PUBLIC_SUPABASE_URL</code>{' '}
                and{' '}
                <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>{' '}
                in{' '}
                <code>frontend/.env.local</code>
                {' '}and restart the frontend.
              </p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-800"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                aria-hidden="true"
              />

              <span>{error}</span>
            </motion.div>
          )}

          {notice && (
            <p
              role="status"
              className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-3.5 text-sm leading-5 text-blue-900"
            >
              {notice}
            </p>
          )}

          {step === 'email' && (
            <form
              onSubmit={handleSendMagicLink}
              className="space-y-5"
            >
              <div>

                <label
                  htmlFor="login-email"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Email address
                </label>

                <div className="relative">

                  <Mail
                    className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />

                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    disabled={isBusy}
                    className="block min-h-12 w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                  />

                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={isSending || authLoading}
                loadingText="Sending sign-in link…"
                disabled={!configured || isBusy}
                rightIcon={
                  <ArrowRight
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                }
                className="!bg-none !bg-blue-700 !text-white shadow-lg shadow-blue-200 hover:!bg-blue-800"
              >
                Send Sign-in Link
              </Button>
            </form>
          )}

          {step === 'sent' && (
            <div className="space-y-5">

              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
                  <Mail
                    className="h-8 w-8 text-blue-700"
                    aria-hidden="true"
                  />
                </div>
              </div>

              <div className="text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                  Your sign-in link is on its way
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Open your email and click the{' '}
                  <strong>Sign in</strong>{' '}
                  link from Supabase Auth.
                </p>
              </div>

              <Button
                type="button"
                variant="primary"
                fullWidth
                size="lg"
                disabled={isBusy || cooldown > 0}
                isLoading={isSending}
                loadingText="Sending…"
                rightIcon={
                  <RefreshCw
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                }
                onClick={handleResend}
                className="!bg-none !bg-blue-700 !text-white shadow-lg shadow-blue-200 hover:!bg-blue-800"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : 'Resend Sign-in Link'}
              </Button>

              <button
                type="button"
                onClick={changeEmail}
                disabled={isBusy}
                className="mx-auto flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium text-slate-600 hover:text-blue-700 disabled:opacity-50"
              >
                <ArrowLeft
                  className="h-4 w-4"
                  aria-hidden="true"
                />
                Change email
              </button>

            </div>
          )}

          <div className="mt-6 flex items-start gap-2.5 border-t border-slate-100 pt-5 text-xs leading-5 text-slate-500">

            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
              aria-hidden="true"
            />

            <p>
              LoanAI uses passwordless authentication through
              Supabase Auth. Your password is never required.
            </p>

          </div>

        </Card>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          New users can create their account automatically
          through their first verified email sign-in.
        </p>

      </motion.div>
    </main>
  );
}