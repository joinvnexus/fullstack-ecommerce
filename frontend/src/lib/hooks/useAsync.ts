// useAsync Hook Pattern - For handling async operations with proper error handling
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface UseAsyncOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useAsync<T>(
  options?: UseAsyncOptions<T>
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
} & AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (asyncFn: () => Promise<T>): Promise<T | null> => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const data = await asyncFn();
        setState((prev) => ({ ...prev, data, loading: false }));
        options?.onSuccess?.(data);
        return data;
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        setState((prev) => ({ ...prev, error: errorObj, loading: false }));
        options?.onError?.(errorObj);
        return null;
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute: execute as (...args: unknown[]) => Promise<T | null>,
    reset,
  };
}

// Example usage:
/*
const { data, loading, error, execute } = useAsync({
  onSuccess: (data) => toast.success('Operation successful'),
  onError: (error) => toast.error(error.message),
});

const handleSubmit = async () => {
  await execute(() => api.post('/endpoint', data));
};
*/
