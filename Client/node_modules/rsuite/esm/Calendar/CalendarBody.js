'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Grid from "./Grid/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { getWeekStartDates } from "../internals/utils/date/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { useCalendar } from "./hooks/index.js";
import { useGetAriaLabelForMonth } from "./utils/getAriaLabel.js";
/**
 * The calendar month view, i.e. grid of dates.
 */
const CalendarBody = forwardRef((props, ref) => {
  const {
    yearMonth,
    as: Component = 'div',
    className,
    classPrefix = 'calendar-body',
    ...rest
  } = props;
  const {
    locale: overrideLocale,
    weekStart
  } = useCalendar();
  const {
    getLocale
  } = useCustom();
  const locale = getLocale('Calendar', overrideLocale);
  const getAriaLabelForMonth = useGetAriaLabelForMonth();
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement(Grid, {
    rows: getWeekStartDates(yearMonth, {
      weekStart,
      locale: locale === null || locale === void 0 ? void 0 : locale.dateLocale
    }),
    "aria-label": getAriaLabelForMonth(yearMonth)
  }));
});
CalendarBody.displayName = 'CalendarBody';
export default CalendarBody;