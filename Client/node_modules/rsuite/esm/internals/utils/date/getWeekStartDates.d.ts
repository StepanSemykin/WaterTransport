import type { Locale } from 'date-fns';
import type { PlainDate, PlainYearMonth } from './types';
/**
 * Get the first days of weeks in a month。
 * @param month The month
 * @param options.weekStart the index of the first day of the week (0 - Sunday)
 * @param options.isoWeek Whether to use ISO week
 * @returns A list of first days of weeks in a month
 */
export declare function getWeekStartDates(month: PlainYearMonth, options: {
    weekStart?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    locale?: Locale;
}): PlainDate[];
export default getWeekStartDates;
