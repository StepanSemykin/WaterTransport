'use client';
import { useCallback } from 'react';
/**
 * Returns a function that determines whether a date is disabled and is compatible with the deprecated `disabledDate` prop.
 */
export function useDateDisabled(props) {
  const {
    shouldDisableDate
  } = props;
  const isDateDisabled = useCallback((date, options) => {
    const {
      selectDate,
      selectedDone,
      target
    } = options;
    if (typeof shouldDisableDate === 'function') {
      return shouldDisableDate(date, selectDate, selectedDone, target);
    }
    return false;
  }, [shouldDisableDate]);
  if (shouldDisableDate) {
    return isDateDisabled;
  }
  return undefined;
}
export default useDateDisabled;