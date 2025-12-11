'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import partial from 'lodash/partial';
import { forwardRef } from "../../internals/utils/index.js";
import { isSameDay } from "../../internals/utils/date/plainDate.js";
import { useStyles, useCustom } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";
import { getAriaLabel } from "../utils/index.js";
const GridCell = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    classPrefix = 'calendar-table',
    disabled,
    selected,
    date,
    onSelect,
    unSameMonth,
    rangeStart,
    rangeEnd,
    inRange,
    ...rest
  } = props;
  const jsDate = new Date(date.year, date.month - 1, date.day);
  const {
    onMouseMove,
    cellClassName,
    renderCell,
    renderCellOnPicker,
    locale: overrideLocale
  } = useCalendar();
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  const {
    getLocale,
    formatDate
  } = useCustom();
  const {
    formattedDayPattern,
    today
  } = getLocale('Calendar', overrideLocale);
  const formatStr = formattedDayPattern;
  const ariaLabel = getAriaLabel(jsDate, formatStr, formatDate);
  const isToday = isSameDay(date, new Date());
  const classes = merge(prefix('cell', {
    'cell-un-same-month': unSameMonth,
    'cell-is-today': isToday,
    'cell-selected': selected,
    'cell-selected-start': rangeStart,
    'cell-selected-end': rangeEnd,
    'cell-in-range': !unSameMonth && inRange,
    'cell-disabled': disabled
  }), cellClassName === null || cellClassName === void 0 ? void 0 : cellClassName(date));
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref,
    role: "gridcell",
    "aria-label": ariaLabel,
    "aria-selected": selected || undefined,
    "aria-disabled": disabled || undefined,
    tabIndex: selected ? 0 : -1,
    title: isToday ? `${ariaLabel} (${today})` : ariaLabel,
    className: classes,
    onMouseEnter: !disabled && onMouseMove ? onMouseMove.bind(null, date) : undefined,
    onClick: onSelect ? partial(onSelect, date, disabled) : undefined
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: prefix('cell-content')
  }, renderCellOnPicker ? renderCellOnPicker(date) : /*#__PURE__*/React.createElement("span", {
    className: prefix('cell-day')
  }, date.day), renderCell === null || renderCell === void 0 ? void 0 : renderCell(date)));
});
GridCell.displayName = 'CalendarGridCell';
export default GridCell;