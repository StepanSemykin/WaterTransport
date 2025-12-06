'use client';
import { useCallback, useMemo } from 'react';
import { format as formatDate } from "../../internals/utils/date/index.js";
import { useCustom } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";

/**
 * Get aria-label for the date.
 * @param date - The date.
 * @param formatStr - The format string.
 * @param format - The format function.
 */
export function getAriaLabel(date, formatStr, format) {
  return format ? format(date, formatStr) : formatDate(date, formatStr);
}
export function useGetAriaLabelForMonth() {
  const {
    locale: overrideLocale
  } = useCalendar();
  const {
    getLocale,
    formatDate
  } = useCustom('Calendar');
  const {
    formattedMonthPattern
  } = useMemo(() => getLocale('Calendar', overrideLocale), [getLocale, overrideLocale]);
  return useCallback(month => formatDate(new Date(month.year, month.month - 1, 1), formattedMonthPattern), [formatDate, formattedMonthPattern]);
}