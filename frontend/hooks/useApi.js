import { useState, useCallback } from 'react';

export function useApi() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const execute = useCallback(async (apiFunction, ...args) => {
    setIsPending(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    error,
    isPending,
    execute,
    reset,
  };
}