import { useState, useEffect } from 'react';

/**
 * Debounce any value with configurable delay
 */
export function useDebouncedSearch<T>(value: T, delayMs = 400): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delayMs);

    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debounced;
}

