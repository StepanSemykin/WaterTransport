'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useEffect, useRef } from 'react';
import partial from 'lodash/partial';
import camelCase from 'lodash/camelCase';
import isNumber from 'lodash/isNumber';
import TimeColumn from "./TimeColumn.js";
import { forwardRef } from "../../internals/utils/index.js";
import { useStyles, useEventCallback } from "../../internals/hooks/index.js";
import { getHours, omitHideDisabledProps } from "../../internals/utils/date/index.js";
import { useCalendar } from "../hooks/index.js";
import { getTimeLimits, getClockTime, scrollToTime, formatWithLeadingZero } from "./utils/index.js";
const TimeDropdown = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'calendar-time-dropdown',
    show,
    showMeridiem = false,
    ...rest
  } = props;
  const {
    locale,
    format,
    date,
    onChangeTime,
    targetId
  } = useCalendar();
  const rowRef = useRef(null);
  useEffect(() => {
    const time = getClockTime({
      format,
      date,
      showMeridiem
    });
    // The currently selected time scrolls to the visible range.
    if (show && rowRef.current) {
      scrollToTime(time, rowRef.current);
    }
  }, [date, format, show, showMeridiem]);
  const time = getClockTime({
    format,
    date,
    showMeridiem
  });
  const handleClick = useEventCallback((type, d, event) => {
    var _time$hours, _time$minutes, _time$seconds;
    const nextTime = {
      hour: ((_time$hours = time.hours) !== null && _time$hours !== void 0 ? _time$hours : 0) + (time.meridiem === 'PM' ? 12 : 0),
      minute: (_time$minutes = time.minutes) !== null && _time$minutes !== void 0 ? _time$minutes : 0,
      second: (_time$seconds = time.seconds) !== null && _time$seconds !== void 0 ? _time$seconds : 0
    };
    switch (type) {
      case 'hours':
        nextTime.hour = time.meridiem === 'PM' ? d + 12 : d;
        break;
      case 'minutes':
        nextTime.minute = d;
        break;
      case 'seconds':
        nextTime.second = d;
        break;
    }
    onChangeTime === null || onChangeTime === void 0 || onChangeTime(nextTime, event);
  });
  const handleClickMeridiem = useEventCallback((meridiem, event) => {
    var _time$hours2, _time$minutes2, _time$seconds2;
    const nextTime = {
      hour: ((_time$hours2 = time.hours) !== null && _time$hours2 !== void 0 ? _time$hours2 : 0) + (time.meridiem === 'PM' ? 12 : 0),
      minute: (_time$minutes2 = time.minutes) !== null && _time$minutes2 !== void 0 ? _time$minutes2 : 0,
      second: (_time$seconds2 = time.seconds) !== null && _time$seconds2 !== void 0 ? _time$seconds2 : 0
    };
    if (meridiem === 'AM' && nextTime.hour >= 12) {
      nextTime.hour -= 12;
    } else if (meridiem === 'PM' && nextTime.hour < 12) {
      nextTime.hour += 12;
    }
    onChangeTime === null || onChangeTime === void 0 || onChangeTime(nextTime, event);
  });
  const {
    prefix,
    rootPrefix,
    merge
  } = useStyles(classPrefix);
  const plainDate = typeof date !== 'undefined' ? {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate()
  } : undefined;
  const renderColumn = (type, value) => {
    if (!isNumber(value)) {
      return null;
    }
    const {
      start,
      end
    } = getTimeLimits(showMeridiem)[type];
    const items = [];
    const hideFunc = props[camelCase(`hide_${type}`)];
    const disabledFunc = props[camelCase(`disabled_${type}`)];
    for (let i = start; i <= end; i += 1) {
      if (!(hideFunc !== null && hideFunc !== void 0 && hideFunc(i, plainDate))) {
        const disabled = disabledFunc === null || disabledFunc === void 0 ? void 0 : disabledFunc(i, plainDate);
        const itemClasses = prefix('cell', {
          'cell-active': value === i,
          'cell-disabled': disabled
        });
        items.push(/*#__PURE__*/React.createElement("li", {
          key: i,
          role: "option",
          tabIndex: -1,
          "aria-label": `${i} ${type}`,
          "aria-selected": value === i,
          "aria-disabled": disabled,
          "data-key": `${type}-${i}`,
          onClick: !disabled ? partial(handleClick, type, i) : undefined
        }, /*#__PURE__*/React.createElement("span", {
          className: itemClasses
        }, showMeridiem && type === 'hours' && i === 0 ? 12 : formatWithLeadingZero(i))));
      }
    }
    return /*#__PURE__*/React.createElement(TimeColumn, {
      prefix: prefix,
      title: locale === null || locale === void 0 ? void 0 : locale[type],
      "data-type": type,
      "aria-label": `Select ${type}`
    }, items);
  };
  const renderMeridiemColumn = () => {
    const columns = ['AM', 'PM'];
    return /*#__PURE__*/React.createElement(TimeColumn, {
      prefix: prefix,
      title: 'AM/PM',
      "data-type": "meridiem",
      "aria-label": "Select meridiem"
    }, columns.map((meridiem, index) => {
      const ampm = date && (getHours(date) >= 12 ? 'PM' : 'AM');
      const itemClasses = prefix('cell', {
        'cell-active': ampm === meridiem
      });
      return /*#__PURE__*/React.createElement("li", {
        key: index,
        role: "option",
        tabIndex: -1,
        "aria-label": meridiem,
        "aria-selected": ampm === meridiem,
        "data-key": `meridiem-${meridiem}`,
        onClick: partial(handleClickMeridiem, meridiem)
      }, /*#__PURE__*/React.createElement("span", {
        className: itemClasses
      }, meridiem));
    }));
  };
  const classes = merge(className, rootPrefix(classPrefix), {
    show
  });
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "group",
    tabIndex: -1,
    id: targetId ? `${targetId}-${classPrefix}` : undefined
  }, omitHideDisabledProps(rest), {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix('content')
  }, /*#__PURE__*/React.createElement("div", {
    className: prefix('row'),
    ref: rowRef
  }, renderColumn('hours', time.hours), renderColumn('minutes', time.minutes), renderColumn('seconds', time.seconds), showMeridiem && renderMeridiemColumn())));
});
TimeDropdown.displayName = 'TimeDropdown';
export default TimeDropdown;