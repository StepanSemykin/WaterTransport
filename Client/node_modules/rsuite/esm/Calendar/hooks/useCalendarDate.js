'use client';
import { useState, useCallback, useRef } from 'react';
import { useUpdateEffect } from "../../internals/hooks/index.js";
import { startOfToday } from "../../internals/utils/date/index.js";
export const useCalendarDate = (value, defaultDate) => {
  var _ref;
  const valueRef = useRef(value);
  const [calendarDate, setValue] = useState((_ref = value !== null && value !== void 0 ? value : defaultDate) !== null && _ref !== void 0 ? _ref : startOfToday());
  const setCalendarDate = useCallback(date => {
    if (date && (date === null || date === void 0 ? void 0 : date.valueOf()) !== (calendarDate === null || calendarDate === void 0 ? void 0 : calendarDate.valueOf())) {
      setValue(date);
    }
  }, [calendarDate]);
  const resetCalendarDate = useCallback((nextValue = value) => {
    var _ref2;
    setValue((_ref2 = nextValue !== null && nextValue !== void 0 ? nextValue : defaultDate) !== null && _ref2 !== void 0 ? _ref2 : startOfToday());
  }, [defaultDate, value]);
  useUpdateEffect(() => {
    var _valueRef$current;
    if ((value === null || value === void 0 ? void 0 : value.valueOf()) !== ((_valueRef$current = valueRef.current) === null || _valueRef$current === void 0 ? void 0 : _valueRef$current.valueOf())) {
      var _ref3;
      setCalendarDate((_ref3 = value !== null && value !== void 0 ? value : defaultDate) !== null && _ref3 !== void 0 ? _ref3 : startOfToday());
      valueRef.current = value;
    }
  }, [value, defaultDate]);
  return {
    calendarDate,
    setCalendarDate,
    resetCalendarDate
  };
};