import type { PlainDate, PlainDateTime, PlainYearMonth } from './types';
export declare function toPlainDateTime(date: Date): PlainDateTime;
/**
 * Resembles the behavior of `Temporal.PlainDate.compare`.
 *
 * @see https://tc39.es/proposal-temporal/docs/plaindatetime.html#compare
 */
export declare function compare(date1: PlainDate, date2: PlainDate): -1 | 0 | 1;
/**
 * Resembles the behavior of `Temporal.PlainDate.prototype.equals`.
 *
 * @see https://tc39.es/proposal-temporal/docs/plaindatetime.html#equals
 */
export declare function equals(date1: PlainDate, date2: PlainDate): boolean;
export declare function isSameDay(date: PlainDate, jsDate: Date): boolean;
export declare function addDays(date: PlainDate, days: number): PlainDate;
/**
 * Resembles the behavior of `Temporal.PlainYearMonth.prototype.toString`.
 *
 * @example
 * plainYearMonthToString({ year: 2025, month: 9 }); // => '2025-09'
 *
 * @see https://tc39.es/proposal-temporal/docs/plainyearmonth.html#toString
 */
export declare function plainYearMonthToString(yearMonth: PlainYearMonth): string;
export declare function isEveryDayInMonth(yearMonth: PlainYearMonth, predicate: (date: PlainDate) => boolean): boolean;
