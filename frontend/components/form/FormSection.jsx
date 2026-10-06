'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function FormSection({
  children,
  title,
  description,
  step,
  className = '',
  animate = true,
  ...props
}) {
  const sectionContent = (
    <div
      className={clsx('space-y-5 rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6', className)}
      {...props}
    >
      {title && (
        <div className="flex items-start gap-3">
          {step && (
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
              {step}
            </span>
          )}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            {description && <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>}
          </div>
        </div>
      )}
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );

  if (!animate) {
    return sectionContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {sectionContent}
    </motion.div>
  );
}
