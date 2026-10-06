import { useState, useCallback } from 'react';

const PREDICTION_KEY = 'loan_prediction_result';

export function usePrediction() {
  const [prediction, setPrediction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const storePrediction = useCallback((result) => {
    const payload = {
      ...result,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(PREDICTION_KEY, JSON.stringify(payload));
    setPrediction(payload);
  }, []);

  const getStoredPrediction = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(PREDICTION_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPrediction(parsed);
        return parsed;
      }
    } catch {
      // Invalid JSON or other error
    }
    return null;
  }, []);

  const clearPrediction = useCallback(() => {
    sessionStorage.removeItem(PREDICTION_KEY);
    setPrediction(null);
  }, []);

  const submitPrediction = useCallback(async (apiCall, applicationData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await apiCall(applicationData);
      storePrediction(result);
      return result;
    } catch (err) {
      setError(err.message || 'Prediction failed');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [storePrediction]);

  return {
    prediction,
    isSubmitting,
    error,
    storePrediction,
    getStoredPrediction,
    clearPrediction,
    submitPrediction,
  };
}