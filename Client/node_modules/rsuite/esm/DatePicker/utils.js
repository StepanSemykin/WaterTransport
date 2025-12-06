'use client';
import omit from 'lodash/omit';
import { overlayPropKeys } from "../internals/Picker/index.js";
import { subDays, startOfDay, endOfDay, calendarOnlyProps, startOfToday } from "../internals/utils/date/index.js";
export function getDefaultRanges(value) {
  const today = startOfToday();

  /**
   * If it is an array type, it returns the default shortcut key suitable for DateRangePicker Toolbar,
   * otherwise it returns the default shortcut key suitable for DatePicker Toolbar
   */
  if (value instanceof Array) {
    return [{
      label: 'today',
      value: [startOfDay(today), endOfDay(today)]
    }, {
      label: 'yesterday',
      value: [startOfDay(subDays(today, 1)), endOfDay(subDays(today, 1))]
    }, {
      label: 'last7Days',
      value: [startOfDay(subDays(today, 6)), endOfDay(today)]
    }];
  }
  return [{
    label: 'today',
    value: today
  }, {
    label: 'yesterday',
    value: subDays(today, 1)
  }];
}
const generateRangesIterator = ({
  calendarDate
}) => ({
  value,
  ...rest
}) => ({
  value: typeof value === 'function' ? value(calendarDate) : value,
  ...rest
});

/**
 * get Toolbar ranges from Toolbar props
 * @param ranges
 * @param calendarDate
 */
export const getRanges = ({
  ranges,
  calendarDate
}) => {
  return typeof ranges === 'undefined' ? getDefaultRanges(calendarDate) : ranges.map(generateRangesIterator({
    calendarDate
  }));
};
export function splitRanges(ranges) {
  // The shortcut option on the left side of the calendar panel
  const sideRanges = ranges === null || ranges === void 0 ? void 0 : ranges.filter(range => (range === null || range === void 0 ? void 0 : range.placement) === 'left');

  // The shortcut option on the bottom of the calendar panel
  const bottomRanges = ranges === null || ranges === void 0 ? void 0 : ranges.filter(range => (range === null || range === void 0 ? void 0 : range.placement) === 'bottom' || (range === null || range === void 0 ? void 0 : range.placement) === undefined);
  return {
    sideRanges,
    bottomRanges
  };
}
export const getRestProps = (props, omitProps = []) => {
  return omit(props, [...overlayPropKeys, ...calendarOnlyProps, ...omitProps]);
};