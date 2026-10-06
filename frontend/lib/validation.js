import { z } from 'zod';

export const loanApplicationSchema = z.object({
  Gender: z.string().min(1, 'Gender is required'),
  Married: z.string().min(1, 'Marital status is required'),
  Dependents: z.string().min(1, 'Number of dependents is required'),
  Education: z.string().min(1, 'Education level is required'),
  Self_Employed: z.string().min(1, 'Employment status is required'),

  ApplicantIncome: z.coerce
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Applicant income cannot be negative')
    .max(1000000, 'Applicant income exceeds maximum limit'),

  CoapplicantIncome: z.coerce
    .number({ invalid_type_error: 'Must be a number' })
    .nonnegative('Co-applicant income cannot be negative')
    .max(1000000, 'Co-applicant income exceeds maximum limit'),

  LoanAmount: z.coerce
    .number({ invalid_type_error: 'Must be a number' })
    .positive('Loan amount must be greater than 0')
    .max(1000000, 'Loan amount exceeds maximum limit'),

  Loan_Amount_Term: z.coerce
    .number({ invalid_type_error: 'Must be a number' })
    .int('Loan term must be a whole number')
    .positive('Loan term must be greater than 0')
    .max(480, 'Loan term cannot exceed 480 months'),

  Credit_History: z.coerce
    .number({ invalid_type_error: 'Credit history is required' })
    .min(0, 'Credit history must be 0 or 1')
    .max(1, 'Credit history must be 0 or 1'),

  Property_Area: z.string().min(1, 'Property area is required'),
});

// Type inference helper for documentation purposes
// export type LoanApplication = z.infer<typeof loanApplicationSchema>;