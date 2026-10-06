'use client';

import { cloneElement, isValidElement } from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  asChild = false,
  onClick,
  ...props
}) {
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-r from-primary-600 to-primary-500
      text-white shadow-md hover:shadow-lg
      hover:from-primary-700 hover:to-primary-600
      active:from-primary-800 active:to-primary-700
      focus-visible:ring-primary-500
    `,
    secondary: `
      bg-white text-primary-700 border-2 border-primary-200
      hover:bg-primary-50 hover:border-primary-300
      active:bg-primary-100
      focus-visible:ring-primary-500
    `,
    ghost: `
      text-primary-600 hover:bg-primary-50
      active:bg-primary-100
      focus-visible:ring-primary-500
    `,
    danger: `
      bg-gradient-to-r from-error-600 to-error-500
      text-white shadow-md hover:shadow-lg
      hover:from-error-700 hover:to-error-600
      active:from-error-800 active:to-error-700
      focus-visible:ring-error-500
    `,
    success: `
      bg-gradient-to-r from-success-600 to-success-500
      text-white shadow-md hover:shadow-lg
      hover:from-success-700 hover:to-success-600
      active:from-success-800 active:to-success-700
      focus-visible:ring-success-500
    `,
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  const widthStyles = fullWidth ? 'w-full' : '';
  const childContent = asChild && isValidElement(children)
    ? children.props.children
    : children;

  const combinedClass = clsx(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyles,
    className
  );

  const isDisabled = disabled || isLoading;
  const content = isLoading ? (
    <>
      <LoadingSpinner size={size === 'sm' ? 'sm' : 'md'} />
      <span aria-live="polite">{loadingText}</span>
    </>
  ) : (
    <>
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{childContent}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </>
  );

  if (asChild) {
    if (!isValidElement(children)) {
      throw new Error('Button with asChild requires one valid React element child.');
    }

    const childClick = children.props.onClick;
    const childProps = {
      ...props,
      ...children.props,
      className: clsx(combinedClass, children.props.className),
      onClick: (event) => {
        if (isDisabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) childClick?.(event);
      },
      children: content,
    };

    if (children.type === 'button') {
      childProps.type = type;
      childProps.disabled = isDisabled;
    } else if (isDisabled) {
      childProps['aria-disabled'] = true;
      childProps.tabIndex = -1;
    }

    return (
      <motion.span
        className={clsx('inline-flex', fullWidth && 'w-full')}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      >
        {cloneElement(children, childProps)}
      </motion.span>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={isDisabled}
      className={combinedClass}
      onClick={onClick}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      {...props}
    >
      {content}
    </motion.button>
  );
}

function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-5 h-5 border-2',
    lg: 'w-6 h-6 border-3',
  };

  return (
    <motion.svg
      className={clsx(sizeClasses[size], 'animate-spin')}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="text-current opacity-25"
        cx="12"
        cy="12"
        r="10"
        strokeWidth="4"
        stroke="currentColor"
      />
      <motion.path
        className="text-current"
        d="M12 2a10 10 0 0 1 10 10"
        strokeWidth="4"
        strokeLinecap="round"
        stroke="currentColor"
        animate={{ pathLength: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.svg>
  );
}
