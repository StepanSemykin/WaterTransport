'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import PagePreviousIcon from '@rsuite/icons/PagePrevious';
import PageNextIcon from '@rsuite/icons/PageNext';
import IconButton from "../IconButton/index.js";
import Button from "../Button/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { extractTimeFormat } from "../internals/utils/date/index.js";
import { FormattedDate } from "../internals/intl/FormattedDate.js";
import { useCalendar } from "./hooks/index.js";
import { useDateRangePicker } from "../DateRangePicker/hooks/index.js";
const CalendarHeader = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-header',
    disabledBackward,
    disabledForward,
    showDate,
    showMonth,
    showTime,
    disabledTime,
    onMoveBackward,
    onMoveForward,
    onToggleMonthDropdown,
    onToggleTimeDropdown,
    renderTitle: renderTitleProp,
    renderToolbar,
    ...rest
  } = props;
  const {
    locale,
    date = new Date(),
    format,
    inline,
    disabledDate,
    targetId
  } = useCalendar();
  const {
    isSelectedIdle
  } = useDateRangePicker();
  const {
    prefix,
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const btnProps = {
    appearance: 'subtle',
    size: inline ? 'sm' : 'xs'
  };
  const timeFormat = useMemo(() => {
    const defaultTimeFormat = (locale === null || locale === void 0 ? void 0 : locale.shortTimeFormat) || 'HH:mm';
    if (!format) {
      return defaultTimeFormat;
    }
    return extractTimeFormat(format) || defaultTimeFormat;
  }, [format, locale]);
  const dateFormat = useMemo(() => {
    if (showMonth) {
      return (locale === null || locale === void 0 ? void 0 : locale.formattedMonthPattern) || 'yyyy-MM';
    }
    return 'yyyy';
  }, [locale, showMonth]);
  const renderTitle = () => {
    var _renderTitleProp;
    return (_renderTitleProp = renderTitleProp === null || renderTitleProp === void 0 ? void 0 : renderTitleProp(date)) !== null && _renderTitleProp !== void 0 ? _renderTitleProp : date && /*#__PURE__*/React.createElement(FormattedDate, {
      date: date,
      formatStr: dateFormat
    });
  };
  const dateTitleClasses = prefix('title', 'title-date', {
    error: disabledDate === null || disabledDate === void 0 ? void 0 : disabledDate({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    })
  });
  const timeTitleClasses = prefix('title', 'title-time', {
    error: disabledTime === null || disabledTime === void 0 ? void 0 : disabledTime(date)
  });
  const backwardClass = prefix('backward', {
    'btn-disabled': disabledBackward
  });
  const forwardClass = prefix('forward', {
    'btn-disabled': disabledForward
  });
  const monthToolbar = /*#__PURE__*/React.createElement("div", {
    className: prefix('month-toolbar')
  }, /*#__PURE__*/React.createElement(IconButton, _extends({}, btnProps, {
    // TODO: aria-label should be translated by i18n
    "aria-label": "Previous month",
    className: backwardClass,
    onClick: disabledBackward ? undefined : onMoveBackward,
    icon: /*#__PURE__*/React.createElement(PagePreviousIcon, null)
  })), /*#__PURE__*/React.createElement(Button, _extends({}, btnProps, {
    "aria-label": "Select month",
    id: targetId ? `${targetId}-grid-label` : undefined,
    className: dateTitleClasses,
    onClick: onToggleMonthDropdown
  }), renderTitle()), /*#__PURE__*/React.createElement(IconButton, _extends({}, btnProps, {
    "aria-label": "Next month",
    className: forwardClass,
    onClick: disabledForward ? undefined : onMoveForward,
    icon: /*#__PURE__*/React.createElement(PageNextIcon, null)
  })));
  const hasMonth = showDate || showMonth;
  const classes = merge(className, withPrefix({
    'has-month': hasMonth,
    'has-time': showTime
  }));

  // If the date is not selected, the time cannot be selected (it only works in DateRangePicker).
  const disableSelectTime = typeof isSelectedIdle === 'undefined' ? false : !isSelectedIdle;
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: ref,
    className: classes
  }), hasMonth && monthToolbar, showTime && /*#__PURE__*/React.createElement("div", {
    className: prefix('time-toolbar')
  }, /*#__PURE__*/React.createElement(Button, _extends({}, btnProps, {
    "aria-label": "Select time",
    className: timeTitleClasses,
    onClick: onToggleTimeDropdown,
    disabled: disableSelectTime
  }), date && /*#__PURE__*/React.createElement(FormattedDate, {
    date: date,
    formatStr: timeFormat
  }))), renderToolbar === null || renderToolbar === void 0 ? void 0 : renderToolbar(date));
});
CalendarHeader.displayName = 'CalendarHeader';
export default CalendarHeader;