'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import upperFirst from 'lodash/upperFirst';
import { forwardRef } from "../../internals/utils/index.js";
import { getWeekKeys } from "../../internals/utils/date/index.js";
import { useStyles } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";
const GridHeaderRow = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-table',
    ...rest
  } = props;
  const {
    locale,
    showWeekNumbers,
    weekStart
  } = useCalendar();
  const {
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, prefix('row', 'header-row'));
  const weeks = getWeekKeys(weekStart);
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "row"
  }, rest, {
    ref: ref,
    className: classes
  }), showWeekNumbers && /*#__PURE__*/React.createElement("div", {
    className: prefix('header-cell'),
    role: "columnheader"
  }), weeks.map(key => /*#__PURE__*/React.createElement("div", {
    key: key,
    className: prefix('header-cell'),
    role: "columnheader",
    "aria-label": upperFirst(key)
  }, /*#__PURE__*/React.createElement("span", {
    className: prefix('header-cell-content')
  }, locale === null || locale === void 0 ? void 0 : locale[key]))));
});
GridHeaderRow.displayName = 'CalendarGridHeaderRow';
export default GridHeaderRow;