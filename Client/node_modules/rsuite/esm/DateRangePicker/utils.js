'use client';
import { addMonths, isSameDay, shouldRenderTime, isSameSecond, startOfMonth, endOfMonth, startOfISOWeek, endOfISOWeek, startOfWeek, startOfToday, endOfWeek, differenceInCalendarMonths, copyTime } from "../internals/utils/date/index.js";
export function getSafeCalendarDate({
  value,
  calendarKey = 'start',
  allowSameMonth
}) {
  var _value;
  // Update calendarDate if the value is not null
  value = (_value = value) !== null && _value !== void 0 ? _value : [];
  const gap = allowSameMonth ? 0 : 1;
  if (value[0] && value[1]) {
    const diffMonth = differenceInCalendarMonths(value[1], value[0]);
    if (calendarKey === 'start') {
      return [value[0], diffMonth <= 0 ? copyTime({
        from: value[1],
        to: addMonths(value[0], gap)
      }) : value[1]];
    } else if (calendarKey === 'end') {
      return [diffMonth <= 0 ? copyTime({
        from: value[0],
        to: addMonths(value[1], -gap)
      }) : value[0], value[1]];
    }

    // If only the start date
  } else if (value[0]) {
    return [value[0], addMonths(value[0], gap)];
  }
  const todayDate = startOfToday();
  return [todayDate, addMonths(todayDate, gap)];
}
export const isSameRange = (source, dest, format) => {
  // If both are null, reguard as same
  if (null === source && null === dest) return true;
  // If only one is null, regard as different
  if (null === source || null === dest) return false;
  let result = isSameDay(source[0], dest[0]) && isSameDay(source[1], dest[1]);
  if (shouldRenderTime(format)) {
    result &&= isSameSecond(source[0], dest[0]) && isSameSecond(source[1], dest[1]);
  }
  return result;
};
export const getMonthHoverRange = date => [startOfMonth(date), endOfMonth(date)];
export const getWeekHoverRange = (date, options) => {
  const {
    isoWeek,
    weekStart = 0,
    locale
  } = options;
  if (isoWeek) {
    // set to the first day of this week according to ISO 8601, 12:00 am
    return [startOfISOWeek(date), endOfISOWeek(date)];
  }
  return [startOfWeek(date, {
    weekStartsOn: weekStart,
    locale
  }), endOfWeek(date, {
    weekStartsOn: weekStart,
    locale
  })];
};