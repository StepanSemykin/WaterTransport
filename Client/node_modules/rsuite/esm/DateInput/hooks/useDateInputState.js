'use client';
import startCase from 'lodash/startCase';
import { useCallback, useEffect } from 'react';
import { addDays, addMonths, addYears, addHours, addMinutes, addSeconds, isLastDayOfMonth, lastDayOfMonth, isValid } from "../../internals/utils/date/index.js";
import { useCustom } from "../../internals/hooks/index.js";
import { useDateField, patternMap } from "../DateField.js";
export function useDateInputState({
  formatStr,
  locale,
  date,
  isControlledDate
}) {
  const {
    formatDate
  } = useCustom();
  const {
    dateField,
    dispatch,
    toDateString,
    toDate,
    isEmptyValue
  } = useDateField(formatStr, locale.localize, date);
  const setDateOffset = (pattern, offset, callback) => {
    const currentDate = new Date();
    const year = dateField.year || currentDate.getFullYear();
    const month = dateField.month ? dateField.month - 1 : currentDate.getMonth();
    const day = dateField.day || 0;
    const hour = dateField.hour || 0;
    const minute = dateField.minute || 0;
    const second = dateField.second || 0;
    let actionName;
    let value;
    switch (pattern) {
      case 'y':
        actionName = 'setYear';
        value = addYears(new Date(year, 0), offset).getFullYear();
        break;
      case 'M':
        actionName = 'setMonth';
        value = addMonths(new Date(year, month), offset).getMonth() + 1;
        break;
      case 'd':
        {
          actionName = 'setDay';
          const prevDate = new Date(year, month, day);
          value = addDays(prevDate, offset).getDate();
          if (offset > 0) {
            value = isLastDayOfMonth(prevDate) ? 1 : value;
          } else {
            value = prevDate.getDate() === 1 ? lastDayOfMonth(prevDate).getDate() : value;
          }
          break;
        }
      case 'H':
      case 'h':
        actionName = 'setHour';
        value = addHours(new Date(year, month, day, hour), offset).getHours();
        break;
      case 'm':
        actionName = 'setMinute';
        value = addMinutes(new Date(year, month, day, hour, minute), offset).getMinutes();
        break;
      case 's':
        actionName = 'setSecond';
        value = addSeconds(new Date(year, month, day, hour, minute, second), offset).getSeconds();
        break;
      case 'a':
        actionName = 'setHour';
        value = hour >= 12 ? hour - 12 : hour + 12;
        break;
    }
    if (actionName && typeof value === 'number') {
      dispatch({
        type: actionName,
        value
      });
      const field = patternMap[pattern];
      callback === null || callback === void 0 || callback(toDate(field, value));
    }
  };
  const setDateField = (pattern, value, callback) => {
    const field = patternMap[pattern];
    const actionName = `set${startCase(field)}`;
    dispatch({
      type: actionName,
      value
    });
    callback === null || callback === void 0 || callback(toDate(field, value));
  };
  const getDateField = pattern => {
    const fieldName = patternMap[pattern];
    return {
      name: fieldName,
      value: dateField[fieldName]
    };
  };
  const toControlledDateString = () => {
    if (date && isValid(date)) {
      return formatDate(date, formatStr, {
        locale
      });
    }
    // if date is not valid, return uncontrolled date string
    return toDateString();
  };
  const setNewDate = useCallback(value => {
    dispatch({
      type: 'setNewDate',
      value
    });
  }, [dispatch]);
  useEffect(() => {
    if (isControlledDate) {
      if (date && isValid(date)) {
        setNewDate(date);
      } else if (date === null) {
        setNewDate(null);
      }
    }
  }, [date, dispatch, isControlledDate, setNewDate]);
  return {
    dateField,
    setDateOffset,
    setDateField,
    setNewDate,
    getDateField,
    toDateString: isControlledDate ? toControlledDateString : toDateString,
    isEmptyValue
  };
}
export default useDateInputState;