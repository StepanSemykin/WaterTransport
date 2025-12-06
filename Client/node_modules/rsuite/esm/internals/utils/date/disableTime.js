'use client';
import { useCallback } from 'react';
import pick from 'lodash/pick';
import { getHours } from 'date-fns/getHours';
import { getMinutes } from 'date-fns/getMinutes';
import { getSeconds } from 'date-fns/getSeconds';
import { TimeProp } from "./types.js";
const HOURS_PATTERN = /(Hours?)/;
const MINUTES_PATTERN = /(Minutes?)/;
const SECONDS_PATTERN = /(Seconds?)/;

/**
 * Verify that the time is valid.
 *
 * @param props - The calendar props.
 * @param date - The date to check.
 * @returns Whether the time is disabled.
 *
 * @deprecated Use {@link useIsDateTimeDisabled} which handles PlainDateTime instead.
 */
export function disableTime(props, date) {
  if (!date) {
    return false;
  }
  const disabledTimeProps = [TimeProp.DisabledHours, TimeProp.DisabledMinutes, TimeProp.DisabledSeconds, TimeProp.ShouldDisableHour, TimeProp.ShouldDisableMinute, TimeProp.ShouldDisableSecond];
  const calendarProps = pick(props, disabledTimeProps);
  const mapProps = new Map(Object.entries(calendarProps));
  return Array.from(mapProps.keys()).some(key => {
    if (HOURS_PATTERN.test(key)) {
      var _mapProps$get;
      return (_mapProps$get = mapProps.get(key)) === null || _mapProps$get === void 0 ? void 0 : _mapProps$get(getHours(date), date);
    }
    if (MINUTES_PATTERN.test(key)) {
      var _mapProps$get2;
      return (_mapProps$get2 = mapProps.get(key)) === null || _mapProps$get2 === void 0 ? void 0 : _mapProps$get2(getMinutes(date), date);
    }
    if (SECONDS_PATTERN.test(key)) {
      var _mapProps$get3;
      return (_mapProps$get3 = mapProps.get(key)) === null || _mapProps$get3 === void 0 ? void 0 : _mapProps$get3(getSeconds(date), date);
    }
    return false;
  });
}
export default disableTime;

/**
 * Whether a datetime is allowed, based on the `hide*` and `disabled*` props.
 */
export function useIsDateTimeDisabled(timeDropdownProps) {
  return useCallback(dateTime => {
    const calendarProps = timeDropdownProps;
    const mapProps = new Map(Object.entries(calendarProps));
    const date = pick(dateTime, ['year', 'month', 'day']);
    return Array.from(mapProps.keys()).some(key => {
      if (HOURS_PATTERN.test(key)) {
        var _mapProps$get4;
        return (_mapProps$get4 = mapProps.get(key)) === null || _mapProps$get4 === void 0 ? void 0 : _mapProps$get4(dateTime.hour, date);
      }
      if (MINUTES_PATTERN.test(key)) {
        var _mapProps$get5;
        return (_mapProps$get5 = mapProps.get(key)) === null || _mapProps$get5 === void 0 ? void 0 : _mapProps$get5(dateTime.minute, date);
      }
      if (SECONDS_PATTERN.test(key)) {
        var _mapProps$get6;
        return (_mapProps$get6 = mapProps.get(key)) === null || _mapProps$get6 === void 0 ? void 0 : _mapProps$get6(dateTime.second, date);
      }
      return false;
    });
  }, [timeDropdownProps]);
}