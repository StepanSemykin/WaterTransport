'use client';
import { composeFunctions } from "../internals/utils/index.js";
import * as DateUtils from "../internals/utils/date/index.js";
function isAfterDay(date1, date2) {
  return DateUtils.isAfter(new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()), new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
}
function isBeforeDay(date1, date2) {
  return DateUtils.isBefore(new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()), new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()));
}

/**
 Allow the maximum number of days specified, other dates are disabled.
 */
export function allowedMaxDays(days) {
  return (date, selectValue, selectedDone, target) => {
    let beforeLimit = false;
    let afterLimit = false;
    if (selectValue !== null && selectValue !== void 0 && selectValue[0]) {
      const startDate = selectValue[0];
      beforeLimit = composeFunctions(f => DateUtils.addDays(f, -days + 1), f => isAfterDay(f, date))(startDate);
      afterLimit = composeFunctions(f => DateUtils.addDays(f, days - 1), f => isBeforeDay(f, date))(startDate);
    }
    if (target === 'CALENDAR' && !selectedDone && (beforeLimit || afterLimit)) {
      return true;
    }
    return false;
  };
}

/**
 * Only allowed days are specified, other dates are disabled.
 */
export function allowedDays(days) {
  return (date, selectValue, selectedDone, target) => {
    let beforeLimit = false;
    let afterLimit = false;
    if (selectValue !== null && selectValue !== void 0 && selectValue[0]) {
      const startDate = selectValue[0];
      beforeLimit = composeFunctions(f => DateUtils.addDays(f, -days + 1), f => !DateUtils.isSameDay(f, date))(startDate);
      afterLimit = composeFunctions(f => DateUtils.addDays(f, days - 1), f => !DateUtils.isSameDay(f, date))(startDate);
    }
    if (target === 'CALENDAR' && !selectedDone && beforeLimit && afterLimit) {
      return true;
    }
    return false;
  };
}

/**
 Allow specified date range, other dates are disabled.
 */
export function allowedRange(startDate, endDate) {
  return date => {
    if (isBeforeDay(date, new Date(startDate)) || isAfterDay(date, new Date(endDate))) {
      return true;
    }
    return false;
  };
}

/**
 Disable dates after the specified date.
 */
export function before(beforeDate = new Date()) {
  return date => {
    if (isBeforeDay(date, new Date(beforeDate))) {
      return true;
    }
    return false;
  };
}

/**
 Disable dates before the specified date.
 */
export function after(afterDate = new Date()) {
  return date => {
    if (isAfterDay(date, new Date(afterDate))) {
      return true;
    }
    return false;
  };
}

/**
 Disable dates after today.
 */
export function beforeToday() {
  return before();
}

/**
 Disable dates before today.
 */
export function afterToday() {
  return after();
}

/**
 Used to combine multiple conditions.
 */
export function combine(...args) {
  return (...disabledDateArgs) => {
    return args.reduce((a, b) => a(...disabledDateArgs) || b(...disabledDateArgs));
  };
}