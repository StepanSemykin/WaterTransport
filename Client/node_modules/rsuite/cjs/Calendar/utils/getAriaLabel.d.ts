import type { PlainYearMonth } from '../../internals/utils/date/types';
/**
 * Get aria-label for the date.
 * @param date - The date.
 * @param formatStr - The format string.
 * @param format - The format function.
 */
export declare function getAriaLabel(date: Date, formatStr: string, format: (date: Date, formatStr: string) => string): string;
export declare function useGetAriaLabelForMonth(): (month: PlainYearMonth) => string;
