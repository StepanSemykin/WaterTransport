'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import CalendarContainer from "../Calendar/CalendarContainer.js";
import { forwardRef } from "../internals/utils/index.js";
import { addMonths, startOfToday } from "../internals/utils/date/index.js";
import { DATERANGE_DISABLED_TARGET } from "../internals/constants/index.js";
import { useCalendarHandlers } from "./hooks/index.js";
const Calendar = forwardRef((props, ref) => {
  const {
    as: Component = CalendarContainer,
    calendarDateRange = [startOfToday(), addMonths(startOfToday(), 1)],
    format = 'yyyy-MM-dd',
    disabledDate,
    index = 0,
    limitEndYear,
    limitStartYear,
    onChangeCalendarMonth,
    onChangeCalendarTime,
    onSelect,
    renderTitle,
    value = [],
    ...rest
  } = props;
  const calendarKey = index === 0 ? 'start' : 'end';
  const calendarHandlers = useCalendarHandlers({
    index,
    calendarDateRange,
    onChangeCalendarMonth,
    onChangeCalendarTime,
    onSelect
  });
  const disableCalendarDate = useCallback(date => {
    return disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(date, value, DATERANGE_DISABLED_TARGET.CALENDAR);
  }, [disabledDate, value]);
  const handleRenderTitle = useCallback(date => {
    return renderTitle === null || renderTitle === void 0 ? void 0 : renderTitle(date, calendarKey);
  }, [renderTitle, calendarKey]);
  return /*#__PURE__*/React.createElement(Component, _extends({
    "data-testid": `calendar-${calendarKey}`
  }, rest, calendarHandlers, {
    index: index,
    format: format,
    dateRange: value,
    disabledDate: disableCalendarDate,
    limitEndYear: limitEndYear,
    limitStartYear: limitStartYear,
    renderTitle: handleRenderTitle,
    ref: ref
  }));
});
Calendar.displayName = 'DateRangePicker.Calendar';
export default Calendar;