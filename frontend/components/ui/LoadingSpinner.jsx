'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function LoadingSpinner({
  size = 'md',
  variant = 'primary',
  fullScreen = false,
  className = '',
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-2',
    xl: 'w-12 h-12 border-3',
  };

  const variantClasses = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-secondary-600 border-t-transparent',
    error: 'border-error-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  const containerClasses = clsx(
    'inline-block',
    fullScreen ? 'fixed inset-0 z-50' : '',
    'bg-transparent',
    className
  );

  const contentClasses = clsx(
    'rounded-full animate-spin',
    sizeClasses[size],
    variantClasses[variant]
  );

  if (fullScreen) {
    return (
      <div className={containerClasses}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center h-full"
        >
          <div className={contentClasses} />
        </motion.div>
      </div>
    );
  }

  return <div className={contentClasses} />;
}

export function LoadingOverlay({
  isVisible,
  message = 'Loading...',
  variant = 'primary',
}) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4">
          <LoadingSpinner size="lg" variant={variant} />
          <span className="text-text-primary font-medium text-lg">{message}</span>
        </div>
      </motion.div>
    </motion.div>
  );
}