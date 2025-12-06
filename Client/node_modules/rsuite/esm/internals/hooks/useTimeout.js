'use client';
import { useEffect, useRef, useCallback } from 'react';
/**
 * A timer hook
 * @param fn Timer callback function
 * @param ms Milliseconds of the timer
 * @param enabled Whether to open the timer
 */
export function useTimeout(fn, ms = 0, enabled = true) {
  const timeout = useRef(null);
  const callback = useRef(fn);
  const clear = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
  }, []);
  const set = useCallback(() => {
    timeout.current && clearTimeout(timeout.current);
    if (enabled) {
      timeout.current = setTimeout(() => {
        var _callback$current;
        (_callback$current = callback.current) === null || _callback$current === void 0 || _callback$current.call(callback);
      }, ms);
    }
  }, [ms, enabled]);

  // update ref when function changes
  useEffect(() => {
    callback.current = fn;
  }, [fn]);
  useEffect(() => {
    set();
    return clear;
  }, [ms, enabled, set, clear]);
  return {
    clear,
    reset: set
  };
}
export default useTimeout;