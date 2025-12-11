'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo } from 'react';
import ArrowUpIcon from '@rsuite/icons/ArrowUp';
import MonthDropdown from "./MonthDropdown/index.js";
import TimeDropdown from "./TimeDropdown/index.js";
import CalendarBody from "./CalendarBody.js";
import CalendarHeader from "./CalendarHeader.js";
import { useStyles, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { startOfToday, omitHideDisabledProps, DateMode, useDateMode, isValid, setHours, setMinutes, setSeconds } from "../internals/utils/date/index.js";
import { CalendarProvider } from "./CalendarProvider.js";
import { useCalendarState, CalendarState } from "./hooks/index.js";
import { isEveryDayInMonth, toPlainDateTime } from "../internals/utils/date/plainDate.js";
import { useIsDateTimeDisabled } from "../internals/utils/date/disableTime.js";
const CalendarContainer = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar',
    calendarDate: calendarDateProp,
    dateRange,
    disabledBackward,
    defaultState,
    disabledForward,
    format,
    hoverRangeValue,
    inline,
    isoWeek = false,
    weekStart,
    targetId,
    limitEndYear,
    limitStartYear,
    locale,
    monthDropdownProps,
    showMeridiem,
    showWeekNumbers,
    cellClassName: cellClassNameProp,
    disabledDate,
    onChangeMonth,
    onChangeTime,
    onMouseMove: onMouseMoveProp,
    onMoveBackward,
    onMoveForward,
    onSelect: onSelectProp,
    onToggleMonthDropdown,
    onToggleTimeDropdown,
    renderCell: renderCellProp,
    renderCellOnPicker: renderCellOnPickerProp,
    renderTitle,
    renderToolbar,
    ...rest
  } = props;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const calendarDate = useMemo(() => {
    return isValid(calendarDateProp) ? calendarDateProp : startOfToday();
  }, [calendarDateProp]);
  const {
    calendarState,
    reset,
    handlers
  } = useCalendarState({
    defaultState,
    calendarDate,
    onMoveForward,
    onMoveBackward,
    onToggleTimeDropdown,
    onToggleMonthDropdown
  });
  const isDateDisabled = useCallback(date => {
    var _disabledDate;
    return (_disabledDate = disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(toJsDate(date))) !== null && _disabledDate !== void 0 ? _disabledDate : false;
  }, [disabledDate]);
  const isMonthDisabled = useCallback(yearMonth => {
    return isEveryDayInMonth(yearMonth, isDateDisabled);
  }, [isDateDisabled]);
  const handleCloseDropdown = useEventCallback(() => reset());
  const {
    mode,
    has
  } = useDateMode(format);
  const timeMode = calendarState === CalendarState.TIME || mode === DateMode.Time;
  const monthMode = calendarState === CalendarState.MONTH || mode === DateMode.Month;
  const calendarClasses = merge(className, withPrefix({
    'time-view': timeMode,
    'month-view': monthMode,
    'only-time': mode === DateMode.Time,
    'show-week-numbers': showWeekNumbers
  }));
  const timeDropdownProps = useTimeDropdownProps(rest);
  const isDateTimeDisabled = useIsDateTimeDisabled(timeDropdownProps);
  const isTimeDisabled = useCallback(date => isDateTimeDisabled(toPlainDateTime(date)), [isDateTimeDisabled]);
  const handleChangeMonth = useEventCallback((yearMonth, event) => {
    reset();
    // Call `onChangeMonth` with the first day in the month
    onChangeMonth === null || onChangeMonth === void 0 || onChangeMonth(new Date(yearMonth.year, yearMonth.month - 1, 1), event);
  });
  const cellClassName = useCallback(date => cellClassNameProp === null || cellClassNameProp === void 0 ? void 0 : cellClassNameProp(toJsDate(date)), [cellClassNameProp]);
  const onMouseMove = useCallback(date => onMouseMoveProp === null || onMouseMoveProp === void 0 ? void 0 : onMouseMoveProp(toJsDate(date)), [onMouseMoveProp]);
  const onSelect = useCallback((date, event) => onSelectProp === null || onSelectProp === void 0 ? void 0 : onSelectProp(toJsDate(date), event), [onSelectProp]);
  const renderCell = useCallback(date => renderCellProp === null || renderCellProp === void 0 ? void 0 : renderCellProp(toJsDate(date)), [renderCellProp]);
  const renderCellOnPicker = useCallback(date => renderCellOnPickerProp === null || renderCellOnPickerProp === void 0 ? void 0 : renderCellOnPickerProp(toJsDate(date)), [renderCellOnPickerProp]);
  const handleChangeTime = useEventCallback((time, event) => {
    let nextDate = calendarDate || startOfToday();
    nextDate = setHours(nextDate, time.hour);
    nextDate = setMinutes(nextDate, time.minute);
    nextDate = setSeconds(nextDate, time.second);
    onChangeTime === null || onChangeTime === void 0 || onChangeTime(nextDate, event);
  });
  const contextValue = {
    date: calendarDate,
    dateRange,
    format,
    hoverRangeValue,
    inline,
    isoWeek,
    weekStart,
    targetId,
    locale,
    showWeekNumbers,
    monthDropdownProps,
    cellClassName,
    disabledDate: isDateDisabled,
    onChangeMonth: handleChangeMonth,
    onChangeTime: handleChangeTime,
    onMouseMove,
    onSelect,
    renderCell: typeof renderCellProp === 'undefined' ? undefined : renderCell,
    renderCellOnPicker: typeof renderCellOnPickerProp === 'undefined' ? undefined : renderCellOnPicker
  };
  const currentViewingMonth = useMemo(() => {
    return {
      year: calendarDate.getFullYear(),
      month: calendarDate.getMonth() + 1
    };
  }, [calendarDate]);
  return /*#__PURE__*/React.createElement(CalendarProvider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Component, _extends({
    "data-testid": "calendar"
  }, omitHideDisabledProps(rest), {
    className: calendarClasses,
    ref: ref
  }), mode !== DateMode.Time && /*#__PURE__*/React.createElement(CalendarHeader, _extends({}, handlers, {
    showMonth: has('month'),
    showDate: has('day'),
    showTime: has('time'),
    disabledTime: isTimeDisabled,
    renderTitle: renderTitle,
    renderToolbar: renderToolbar,
    disabledBackward: disabledBackward,
    disabledForward: disabledForward
  })), has('day') && /*#__PURE__*/React.createElement(CalendarBody, {
    yearMonth: currentViewingMonth
  }), has('month') && /*#__PURE__*/React.createElement(MonthDropdown, {
    show: monthMode,
    limitEndYear: limitEndYear,
    limitStartYear: limitStartYear,
    isMonthDisabled: isMonthDisabled
  }), has('time') && /*#__PURE__*/React.createElement(TimeDropdown, _extends({}, timeDropdownProps, {
    show: timeMode,
    showMeridiem: showMeridiem
  })), (monthMode || timeMode) && has('day') && /*#__PURE__*/React.createElement("button", {
    className: prefix('btn-close'),
    onClick: handleCloseDropdown,
    "aria-label": `Collapse ${monthMode ? 'month' : 'time'} view`
  }, /*#__PURE__*/React.createElement(ArrowUpIcon, null))));
});
CalendarContainer.displayName = 'CalendarContainer';
export default CalendarContainer;

/**
 * Convert the `hide*` and `disabled*` props from CalendarProps to handle PlainDate instead of Date,
 * to be passed to TimeDropdown.
 */
function useTimeDropdownProps(calendarProps) {
  const {
    hideHours,
    hideMinutes,
    hideSeconds,
    disabledHours,
    disabledMinutes,
    disabledSeconds
  } = calendarProps;
  return useMemo(() => ({
    hideHours: (hour, date) => {
      var _hideHours;
      return (_hideHours = hideHours === null || hideHours === void 0 ? void 0 : hideHours(hour, toJsDate(date))) !== null && _hideHours !== void 0 ? _hideHours : false;
    },
    hideMinutes: (minute, date) => {
      var _hideMinutes;
      return (_hideMinutes = hideMinutes === null || hideMinutes === void 0 ? void 0 : hideMinutes(minute, toJsDate(date))) !== null && _hideMinutes !== void 0 ? _hideMinutes : false;
    },
    hideSeconds: (second, date) => {
      var _hideSeconds;
      return (_hideSeconds = hideSeconds === null || hideSeconds === void 0 ? void 0 : hideSeconds(second, toJsDate(date))) !== null && _hideSeconds !== void 0 ? _hideSeconds : false;
    },
    disabledHours: (hour, date) => {
      var _disabledHours;
      return (_disabledHours = disabledHours === null || disabledHours === void 0 ? void 0 : disabledHours(hour, toJsDate(date))) !== null && _disabledHours !== void 0 ? _disabledHours : false;
    },
    disabledMinutes: (minute, date) => {
      var _disabledMinutes;
      return (_disabledMinutes = disabledMinutes === null || disabledMinutes === void 0 ? void 0 : disabledMinutes(minute, toJsDate(date))) !== null && _disabledMinutes !== void 0 ? _disabledMinutes : false;
    },
    disabledSeconds: (second, date) => {
      var _disabledSeconds;
      return (_disabledSeconds = disabledSeconds === null || disabledSeconds === void 0 ? void 0 : disabledSeconds(second, toJsDate(date))) !== null && _disabledSeconds !== void 0 ? _disabledSeconds : false;
    }
  }), [hideHours, hideMinutes, hideSeconds, disabledHours, disabledMinutes, disabledSeconds]);
}
function toJsDate(date) {
  return new Date(date.year, date.month - 1, date.day);
}