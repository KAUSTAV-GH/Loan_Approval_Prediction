'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';

export const Select = forwardRef(({
  label,
  error,
  options = [],
  placeholder = 'Please select...',
  required = false,
  className = '',
  ...props
}, ref) => {
  const baseStyles = `
    block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition-all duration-200
    cursor-pointer focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100
    disabled:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70
    appearance-none
  `;

  const errorStyles = error
    ? 'border-rose-400 bg-rose-50/60 focus:border-rose-500 focus:ring-rose-100'
    : 'hover:border-slate-300';

  const placeholderStyle = props.value === '' || !props.value
    ? 'text-slate-400'
    : 'text-slate-900';

  return (
    <div className={clsx('relative w-full', className)}>
      {label && (
        <label className="block mb-2 text-sm font-semibold text-slate-800">
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          className={clsx(baseStyles, errorStyles, placeholderStyle)}
          {...props}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="text-slate-900">
              {option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
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

Select.displayName = 'Select';
