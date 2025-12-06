'use client';
import { useMemo, useCallback } from 'react';
import { shouldRenderDate, shouldRenderTime, shouldOnlyRenderMonth, shouldOnlyRenderTime } from "./formatCheck.js";
export let DateMode = /*#__PURE__*/function (DateMode) {
  DateMode["Date"] = "date";
  DateMode["Month"] = "month";
  DateMode["Time"] = "time";
  DateMode["DateTime"] = "datetime";
  return DateMode;
}({});

/**
 * Custom hook to determine the date mode and check format parts.
 *
 * @param format - The format string.
 * @returns An object containing the resolved DateMode and a `has` method to check format parts.
 */
export const useDateMode = format => {
  const mode = useMemo(() => {
    if (shouldRenderDate(format) && shouldRenderTime(format)) {
      return DateMode.DateTime;
    }
    if (shouldOnlyRenderMonth(format)) {
      return DateMode.Month;
    }
    if (shouldOnlyRenderTime(format)) {
      return DateMode.Time;
    }
    if (shouldRenderDate(format)) {
      return DateMode.Date;
    }
    return DateMode.Date; // Default fallback
  }, [format]);

  // Use useCallback to memoize the has method
  const has = useCallback(part => {
    switch (part) {
      case 'year':
        return /[Yy]/.test(format);
      case 'month':
        return /[ML]/.test(format);
      case 'day':
        return /[Dd]/.test(format);
      case 'time':
        return /([Hhms])/.test(format);
      default:
        return false;
    }
  }, [format]);
  return {
    mode,
    has
  };
};