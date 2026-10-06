'use client';

import { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Input } from '@/components/ui/Input.jsx';
import { Select } from '@/components/ui/Select.jsx';

export const FormField = forwardRef(({
  label,
  name,
  type = 'text',
  options = [],
  placeholder,
  required = false,
  error,
  register,
  control,
  className = '',
  ...props
}, ref) => {
  const isSelect = options.length > 0;

  if (isSelect) {
    return (
      <div className={clsx('w-full', className)}>
        <Select
          ref={ref}
          label={label}
          error={error?.message}
          options={options}
          placeholder={placeholder || `Select ${label}...`}
          required={required}
          {...register(name, { required: required || undefined })}
          {...props}
        />
      </div>
    );
  }

  return (
    <div className={clsx('w-full', className)}>
      <Input
        ref={ref}
        label={label}
        error={error?.message}
        type={type}
        placeholder={placeholder}
        required={required}
        {...register(name, { required: required || undefined })}
        {...props}
      />
    </div>
  );
});

FormField.displayName = 'FormField';