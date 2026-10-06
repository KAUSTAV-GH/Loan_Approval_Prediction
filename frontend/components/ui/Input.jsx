'use client';

import { forwardRef, useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({
  label,
  error,
  type = 'text',
  leftIcon,
  rightIcon,
  placeholder,
  required = false,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const baseStyles = `
    block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all duration-200
    placeholder:text-slate-400
    focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
    disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70
  `;

  const errorStyles = error
    ? 'border-rose-400 bg-rose-50/60 focus:border-rose-500 focus:ring-rose-100'
    : 'hover:border-slate-300';

  const iconStyles = `
    flex items-center justify-center w-10 h-10
        text-slate-500 bg-transparent border-r border-slate-200
    first:rounded-l-xl last:rounded-r-xl
  `;

  const hasIcon = leftIcon || (isPassword && !rightIcon);

  return (
    <div className={clsx('relative w-full', className)}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className={iconStyles}>
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          type={inputType}
          placeholder={placeholder}
          className={clsx(baseStyles, errorStyles, hasIcon && 'pl-10', isPassword && 'pr-10')}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-500 hover:text-blue-700 active:scale-95 transition-all duration-200 rounded-lg hover:bg-blue-50"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {rightIcon && !isPassword && (
          <div className={iconStyles}>
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-rose-700 flex items-center gap-2">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 011 1v4a1 1 0 11-2 0V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
