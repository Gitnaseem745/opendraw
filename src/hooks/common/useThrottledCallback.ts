import { useCallback, useRef } from 'react';

/**
 * Custom hook that throttles a callback function to prevent excessive executions.
 * Useful for performance optimization when dealing with high-frequency events.
 * 
 * @template T - The type of the callback function
 * @param {T} callback - The function to throttle
 * @param {number} delay - The minimum delay in milliseconds between executions
 * @returns {T} - The throttled version of the callback function
 */
export const useThrottledCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());
  
  return useCallback((...args: Parameters<T>) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]) as T;
};
