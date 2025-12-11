'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import GridRow from "./GridRow.js";
import GridHeaderRow from "./GridHeaderRow.js";
import { forwardRef } from "../../internals/utils/index.js";
import { useStyles } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";
const Grid = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-table',
    rows = [],
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const {
    targetId
  } = useCalendar();
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "grid",
    tabIndex: -1,
    id: targetId ? `${targetId}-${classPrefix}` : undefined
  }, rest, {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement(GridHeaderRow, null), rows.map((rowStartingDate, index) => /*#__PURE__*/React.createElement(GridRow, {
    key: index,
    startingDate: rowStartingDate,
    rowIndex: index + 1
  })));
});
Grid.displayName = 'CalendarGrid';
export default Grid;