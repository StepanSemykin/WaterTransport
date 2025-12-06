'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import CalendarContainer from "./CalendarContainer.js";
import Button from "../Button/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { isSameMonth, startOfDay } from "../internals/utils/date/index.js";
import { FormattedDate } from "../internals/intl/FormattedDate.js";
import { useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { useCalendarDate } from "./hooks/index.js";
/**
 * The Calendar component is used to select dates.
 * @see https://rsuitejs.com/components/calendar
 */
const Calendar = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Calendar', props);
  const {
    as = CalendarContainer,
    bordered,
    className,
    classPrefix = 'calendar',
    compact,
    defaultValue = startOfDay(new Date()),
    isoWeek,
    weekStart,
    locale,
    cellClassName,
    onChange,
    onMonthChange,
    onSelect,
    renderCell,
    value,
    ...rest
  } = propsWithDefaults;
  const {
    calendarDate,
    setCalendarDate
  } = useCalendarDate(value, defaultValue);
  const handleChange = useEventCallback(nextValue => {
    setCalendarDate(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue);
    if (!isSameMonth(nextValue, calendarDate)) {
      onMonthChange === null || onMonthChange === void 0 || onMonthChange(nextValue);
    }
  });
  const handleClickToday = useEventCallback(() => {
    handleChange(new Date());
  });
  const handleSelect = useEventCallback(nextValue => {
    onSelect === null || onSelect === void 0 || onSelect(nextValue);
    handleChange(nextValue);
  });
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  const renderToolbar = () => /*#__PURE__*/React.createElement(Button, {
    className: prefix('btn-today'),
    size: "sm",
    onClick: handleClickToday
  }, (locale === null || locale === void 0 ? void 0 : locale.today) || 'Today');
  const renderTitle = date => /*#__PURE__*/React.createElement(FormattedDate, {
    date: date,
    formatStr: (locale === null || locale === void 0 ? void 0 : locale.formattedMonthPattern) || 'MMMM  yyyy'
  });
  const classes = merge(className, prefix('panel', {
    bordered,
    compact
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({}, rest, {
    as: as,
    inline: true,
    className: classes,
    ref: ref,
    isoWeek: isoWeek,
    weekStart: weekStart,
    format: "yyyy-MM-dd",
    calendarDate: calendarDate,
    limitEndYear: 1000,
    locale: locale,
    renderTitle: renderTitle,
    renderToolbar: renderToolbar,
    renderCell: renderCell,
    cellClassName: cellClassName,
    onMoveForward: handleChange,
    onMoveBackward: handleChange,
    onChangeMonth: handleChange,
    onSelect: handleSelect
  }));
});
Calendar.displayName = 'Calendar';
export default Calendar;