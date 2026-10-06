'use client';

import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function Card({
  children,
  variant = 'glass',
  padding = 'lg',
  className = '',
  animate = true,
  ...props
}) {
  const variantStyles = {
    glass: `
      bg-white/80 backdrop-blur-xl
      border border-white/30 shadow-xl
      dark:bg-slate-900/80 dark:border-white/10
    `,
    solid: `
      bg-white border border-border-200 shadow-lg
      dark:bg-slate-800 dark:border-slate-700
    `,
    elevated: `
      bg-white border border-border-100 shadow-2xl
      dark:bg-slate-800 dark:border-slate-700/50
    `,
    outlined: `
      bg-transparent border-2 border-border-300
      hover:border-primary-400 transition-colors duration-300
      dark:border-slate-700 dark:hover:border-primary-500
    `,
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const combinedClass = clsx(
    'rounded-2xl transition-all duration-300',
    variantStyles[variant],
    paddingStyles[padding],
    className
  );

  const cardContent = <div className={combinedClass} {...props}>{children}</div>;

  if (!animate) {
    return cardContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {cardContent}
    </motion.div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={clsx('mb-6', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={clsx('text-2xl font-bold text-text-primary', className)}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={clsx('mt-2 text-secondary-600', className)}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={clsx(className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={clsx('mt-6 pt-6 border-t border-border-200', className)}>
      {children}
    </div>
  );
}