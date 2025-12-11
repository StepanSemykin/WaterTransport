'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import { forwardRef } from "../../internals/utils/index.js";
import { useStyles, useCustom, useEventCallback } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";
import { useGetAriaLabelForMonth } from "../utils/getAriaLabel.js";
const MonthDropdownItem = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-month-dropdown-cell',
    yearMonth,
    active,
    disabled,
    ...rest
  } = props;
  const {
    onChangeMonth
  } = useCalendar();
  const formatMonth = useFormatMonth();
  const getAriaLabelForMonth = useGetAriaLabelForMonth();
  const handleClick = useEventCallback(event => {
    if (disabled) {
      return;
    }
    onChangeMonth === null || onChangeMonth === void 0 || onChangeMonth(yearMonth, event);
  });
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    active
  }), {
    disabled
  });
  const ariaLabel = getAriaLabelForMonth(yearMonth);
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "gridcell",
    "aria-selected": active,
    "aria-disabled": disabled,
    "aria-label": ariaLabel,
    tabIndex: active ? 0 : -1,
    ref: ref,
    className: classes,
    onClick: handleClick
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: prefix('content')
  }, formatMonth(yearMonth)));
});
MonthDropdownItem.displayName = 'MonthDropdownItem';
export default MonthDropdownItem;
function useFormatMonth() {
  const {
    formatDate
  } = useCustom('Calendar');
  return useCallback(month => formatDate(new Date(month.year, month.month - 1, 1), 'MMM'), [formatDate]);
}