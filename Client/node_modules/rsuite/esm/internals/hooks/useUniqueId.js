'use client';
import { useId } from 'react';

/**
 * Used for generating unique ID for DOM elements
 *
 * @param idProp If id is provided, it will be used instead of generating a new one
 */
export function useUniqueId(prefix, idProp) {
  const generatedId = useId();
  return idProp !== null && idProp !== void 0 ? idProp : `${prefix}${generatedId}`;
}
export default useUniqueId;