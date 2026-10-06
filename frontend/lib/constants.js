// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Loan Form Field Options
export const GENDER_OPTIONS = [
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

export const MARRIED_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const DEPENDENTS_OPTIONS = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3+' },
];

export const EDUCATION_OPTIONS = [
  { value: 'Graduate', label: 'Graduate' },
  { value: 'Not Graduate', label: 'Not Graduate' },
];

export const SELF_EMPLOYED_OPTIONS = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
];

export const PROPERTY_AREA_OPTIONS = [
  { value: 'Urban', label: 'Urban' },
  { value: 'Semiurban', label: 'Semiurban' },
  { value: 'Rural', label: 'Rural' },
];

export const CREDIT_HISTORY_OPTIONS = [
  { value: '1.0', label: 'Good (1.0)' },
  { value: '0.0', label: 'Poor (0.0)' },
];
