'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import GridCell from "./GridCell.js";
import { forwardRef } from "../../internals/utils/index.js";
import { format } from "../../internals/utils/date/index.js";
import { DATERANGE_DISABLED_TARGET } from "../../internals/constants/index.js";
import { useStyles } from "../../internals/hooks/index.js";
import { useCalendar } from "../hooks/index.js";
import { addDays, compare, isSameDay } from "../../internals/utils/date/plainDate.js";

/**
 * A row in the calendar month view grid, i.e. a week of days.
 */

const GridRow = forwardRef((props, ref) => {
  var _locale$dateLocale$op, _locale$dateLocale;
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-table',
    startingDate,
    rowIndex,
    ...rest
  } = props;
  const {
    date: selected = new Date(),
    dateRange,
    hoverRangeValue,
    isoWeek,
    weekStart,
    showWeekNumbers,
    locale,
    disabledDate,
    onSelect
  } = useCalendar();
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  const handleSelect = useCallback((date, disabled, event) => {
    // TODO: Doma - Consider moving this check for `disabled` into GridCell
    if (disabled) {
      return;
    }
    onSelect === null || onSelect === void 0 || onSelect(date, event);
  }, [onSelect]);
  const renderDays = () => {
    const days = [];
    // The start and end dates of the range selection
    // Note that they can be
    // - Invalid date - when the user is inputting the date with text input
    // - undefined - when the range selection isn't completed
    const [selectedStartDateJS, selectedEndDateJS] = dateRange || [];
    const [hoverStartDateJS, hoverEndDateJS] = hoverRangeValue !== null && hoverRangeValue !== void 0 ? hoverRangeValue : [];
    const isRangeSelectionMode = typeof dateRange !== 'undefined';
    const plainDateRange = typeof dateRange !== 'undefined' ? dateRange.map(d => d instanceof Date ? {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate()
    } : undefined) : undefined;
    for (let i = 0; i < 7; i += 1) {
      const thisDate = addDays(startingDate, i);
      const thisDateJS = new Date(thisDate.year, thisDate.month - 1, thisDate.day);
      const disabled = disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate(thisDate, plainDateRange, DATERANGE_DISABLED_TARGET.CALENDAR);

      // Whether this date is in a different month from the selected date
      const isSameMonth = selected.getFullYear() === thisDate.year && selected.getMonth() + 1 === thisDate.month;

      // Whether this date is the range start date and is in the same month with the selected date
      const isRangeStart = isSameMonth && selectedStartDateJS && isSameDay(thisDate, selectedStartDateJS);

      // Whether this date is the range end date and is in the same month with the selected date
      const isRangeEnd = isSameMonth && selectedEndDateJS && isSameDay(thisDate, selectedEndDateJS);

      // Whether this date should be displayed in the "selected" state
      // Either
      // - In range selection mode, it's either the range start or end date
      // - Otherwise, it's the selected date itself
      const isSelected = isRangeSelectionMode ? isRangeStart || isRangeEnd : isSameDay(thisDate, selected);

      // TODO-Doma Move those logic that's for DatePicker/DateRangePicker to a separate component
      //           Calendar is not supposed to be reused this way
      let inRange = false;
      // for Selected
      if (selectedStartDateJS && selectedEndDateJS) {
        const selectedStartDate = {
          year: selectedStartDateJS.getFullYear(),
          month: selectedStartDateJS.getMonth() + 1,
          day: selectedStartDateJS.getDate()
        };
        const selectedEndDate = {
          year: selectedEndDateJS.getFullYear(),
          month: selectedEndDateJS.getMonth() + 1,
          day: selectedEndDateJS.getDate()
        };
        if (compare(thisDate, selectedEndDate) < 0 && compare(thisDate, selectedStartDate) > 0) {
          inRange = true;
        }
        if (compare(thisDate, selectedStartDate) < 0 && compare(thisDate, selectedEndDate) > 0) {
          inRange = true;
        }
      }

      // for Hovering
      if (!isSelected && hoverStartDateJS && hoverEndDateJS) {
        const hoverStartDate = {
          year: hoverStartDateJS.getFullYear(),
          month: hoverStartDateJS.getMonth() + 1,
          day: hoverStartDateJS.getDate()
        };
        const hoverEndDate = {
          year: hoverEndDateJS.getFullYear(),
          month: hoverEndDateJS.getMonth() + 1,
          day: hoverEndDateJS.getDate()
        };
        if (compare(thisDate, hoverEndDate) <= 0 && compare(thisDate, hoverStartDate) >= 0) {
          inRange = true;
        }
        if (compare(thisDate, hoverStartDate) <= 0 && compare(thisDate, hoverEndDate) >= 0) {
          inRange = true;
        }
      }
      days.push(/*#__PURE__*/React.createElement(GridCell, {
        key: format(thisDateJS, 'yyyy-MM-dd'),
        date: thisDate,
        disabled: disabled,
        selected: isSelected,
        onSelect: handleSelect,
        unSameMonth: !isSameMonth,
        rangeStart: isRangeStart,
        rangeEnd: isRangeEnd,
        inRange: inRange
      }));
    }
    return days;
  };
  const classes = merge(className, prefix('row'));
  const {
    firstWeekContainsDate
  } = (_locale$dateLocale$op = locale === null || locale === void 0 || (_locale$dateLocale = locale.dateLocale) === null || _locale$dateLocale === void 0 ? void 0 : _locale$dateLocale.options) !== null && _locale$dateLocale$op !== void 0 ? _locale$dateLocale$op : {};
  // ISO week starts on Monday
  const date = isoWeek ? addDays(startingDate, 1) : startingDate;
  const week = format(new Date(date.year, date.month - 1, date.day), isoWeek ? 'I' : 'w', {
    locale: locale === null || locale === void 0 ? void 0 : locale.dateLocale,
    firstWeekContainsDate,
    weekStartsOn: weekStart
  });
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: ref,
    role: "row",
    "aria-rowindex": rowIndex,
    className: classes
  }), showWeekNumbers && /*#__PURE__*/React.createElement("div", {
    role: "rowheader",
    "aria-label": `Week ${week}`,
    className: prefix('cell-week-number')
  }, week), renderDays());
});
GridRow.displayName = 'CalendarGridRow';
export default GridRow;