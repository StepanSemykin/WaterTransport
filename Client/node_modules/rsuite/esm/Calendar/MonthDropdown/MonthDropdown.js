'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo } from 'react';
import MonthDropdownItem from "./MonthDropdownItem.js";
import { forwardRef } from "../../internals/utils/index.js";
import { getMonth, getYear } from "../../internals/utils/date/index.js";
import { AutoSizer, FixedSizeList } from "../../internals/Windowing/index.js";
import { useStyles } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";
import { plainYearMonthToString } from "../../internals/utils/date/plainDate.js";
// Array representing the index of each month
const MONTHS_INDEX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

// The height of each item
const ITEM_SIZE = 108;
const MonthDropdown = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-month-dropdown',
    limitStartYear,
    limitEndYear = 5,
    show,
    height: defaultHeight = 221,
    width: defaultWidth = 256,
    isMonthDisabled,
    ...rest
  } = props;
  const {
    date = new Date(),
    targetId,
    monthDropdownProps
  } = useCalendar();
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const thisYear = getYear(new Date());
  const startYear = limitStartYear ? thisYear - limitStartYear + 1 : 1900;
  const rowCount = useMemo(() => {
    const endYear = thisYear + limitEndYear;
    return endYear - startYear;
  }, [limitEndYear, startYear, thisYear]);
  const {
    className: listClassName,
    itemClassName,
    as: List,
    itemAs: Item = 'div',
    ...restListProps
  } = monthDropdownProps || {};
  const rowRenderer = useCallback(({
    index,
    style
  }) => {
    const selectedMonth = getMonth(date);
    const selectedYear = getYear(date);
    const year = startYear + index;
    const isSelectedYear = year === selectedYear;
    const titleClassName = prefix('year', {
      'year-active': isSelectedYear
    });
    return /*#__PURE__*/React.createElement(Item, {
      role: "row",
      "aria-label": `${year}`,
      className: merge(itemClassName, prefix('row'), {
        'first-row': index === 0,
        'last-row': index === rowCount - 1
      }),
      style: style
    }, /*#__PURE__*/React.createElement("div", {
      className: titleClassName,
      role: "rowheader"
    }, year), /*#__PURE__*/React.createElement("div", {
      className: prefix('list')
    }, MONTHS_INDEX.map(month => {
      const yearMonth = {
        year,
        month: month + 1
      }; // TODO: Doma - Should we make a constant pool for optimization?
      return /*#__PURE__*/React.createElement(MonthDropdownItem, {
        key: plainYearMonthToString(yearMonth),
        yearMonth: yearMonth,
        disabled: isMonthDisabled === null || isMonthDisabled === void 0 ? void 0 : isMonthDisabled(yearMonth),
        active: isSelectedYear && month === selectedMonth
      });
    })));
  }, [Item, date, isMonthDisabled, merge, prefix, itemClassName, rowCount, startYear]);
  const classes = merge(className, withPrefix(), {
    show
  });
  const initialItemIndex = getYear(date) - startYear;
  const initialScrollOffset = ITEM_SIZE * initialItemIndex;
  if (!show) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref,
    role: "grid",
    tabIndex: -1,
    className: classes,
    "aria-labelledby": targetId ? `${targetId}-grid-label` : undefined,
    id: targetId ? `${targetId}-calendar-month-dropdown` : undefined,
    "data-testid": "calendar-month-dropdown"
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: prefix('scroll')
  }, /*#__PURE__*/React.createElement(AutoSizer, {
    defaultHeight: defaultHeight,
    defaultWidth: defaultWidth
  }, ({
    height,
    width
  }) => /*#__PURE__*/React.createElement(FixedSizeList, _extends({
    className: merge(prefix('row-wrapper'), listClassName),
    width: width || defaultWidth,
    height: height || defaultHeight,
    itemSize: ITEM_SIZE,
    itemCount: rowCount,
    initialScrollOffset: initialScrollOffset,
    innerElementType: List
  }, restListProps), rowRenderer))));
});
MonthDropdown.displayName = 'MonthDropdown';
export default MonthDropdown;