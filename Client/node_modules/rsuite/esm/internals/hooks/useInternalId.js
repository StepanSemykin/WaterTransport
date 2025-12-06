'use client';
import { useDebugValue, useRef } from 'react';
import uniqueId from 'lodash/uniqueId';

/**
 * Used for generating unique ID for DOM elements
 */
export function useInternalId(namespace) {
  const idRef = useRef(null);
  if (!idRef.current) {
    idRef.current = uniqueId(`internal://${namespace}`);
  }
  useDebugValue(idRef.current);
  return idRef.current;
}
export default useInternalId;