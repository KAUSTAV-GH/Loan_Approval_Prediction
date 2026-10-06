import Link from 'next/link';
import { Home } from 'lucide-react';

export function HomeButton({ className = '', onClick }) {
  return (
    <Link
      href="/"
      aria-label="Go to LoanAI home"
      title="Home"
      onClick={onClick}
      className={`inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-blue-800 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:focus-visible:ring-blue-950 ${className}`}
    >
      <Home className="h-4 w-4" aria-hidden="true" />
      <span>Home</span>
    </Link>
  );
}
