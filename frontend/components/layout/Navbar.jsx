'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { LogOut, Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/Button.jsx';

export function Navbar() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authError, setAuthError] = useState('');

  const closeMobileMenu = () => setMobileMenuOpen(false);
  const handleSignOut = async () => {
    const { error } = await signOut();
    setAuthError(error?.message || '');
  };

  return (
    <nav className="relative border-b border-slate-200 bg-white/90 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label="LoanAI home" className="flex items-center gap-3">
            <span className="flex-shrink-0 text-blue-700" aria-hidden="true">
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4-4-4 4M6 16l-4-4 4-4" />
              </svg>
            </span>
            <span className="text-xl font-bold text-blue-800">LoanAI</span>
          </Link>

          <div className="hidden items-center gap-5 md:flex">
            <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">Home</Link>
            <Link href="/about" className="text-sm font-medium text-slate-600 transition hover:text-blue-700">About</Link>
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">Welcome, {user?.email?.split('@')[0] || 'User'}</span>
                <Button variant="ghost" size="sm" onClick={() => { void handleSignOut(); }} leftIcon={<LogOut className="h-4 w-4" />}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50">
                  <User className="h-4 w-4" aria-hidden="true" /> Sign in
                </Link>
                <Link href="/predict" className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
                  Check Eligibility
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="loanai-mobile-navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div id="loanai-mobile-navigation" className="absolute inset-x-0 top-full z-50 border-b border-slate-200 bg-white p-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link href="/" onClick={closeMobileMenu} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Home</Link>
            <Link href="/about" onClick={closeMobileMenu} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">About</Link>
            {isAuthenticated ? (
              <>
                <span className="px-3 py-2 text-sm text-slate-500">{user?.email || 'Signed in'}</span>
                <Button variant="ghost" size="sm" onClick={() => { void handleSignOut(); closeMobileMenu(); }} leftIcon={<LogOut className="h-4 w-4" />}>
                  Sign out
                </Button>
              </>
            ) : (
              <Link href="/login" onClick={closeMobileMenu} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Sign in</Link>
            )}
            <Link href="/predict" onClick={closeMobileMenu} className="mt-1 rounded-lg bg-blue-700 px-3 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-800">Check Eligibility</Link>
          </div>
        </div>
      )}
      {authError && <p role="alert" className="border-t border-rose-200 bg-rose-50 px-4 py-2 text-center text-sm text-rose-800">{authError}</p>}
    </nav>
  );
}
