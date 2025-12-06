'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useState } from 'react';
import Button from "../Button/index.js";
import Stack from "../Stack/index.js";
import { useUpdateEffect } from "../internals/hooks/index.js";
import { getDefaultRanges, getRanges } from "./utils.js";
const PredefinedRanges = /*#__PURE__*/React.forwardRef(function PredefinedRanges(props, ref) {
  const {
    className,
    disableShortcut,
    onShortcutClick,
    calendarDate,
    ranges: rangesProp,
    locale,
    ...rest
  } = props;
  const [ranges, setRanges] = useState(getRanges(props));
  useUpdateEffect(() => {
    setRanges(getRanges({
      ranges: rangesProp,
      calendarDate
    }));
  }, [calendarDate, rangesProp]);
  const hasLocaleKey = useCallback(key => getDefaultRanges(calendarDate).some(item => item.label === key), [calendarDate]);
  if (ranges.length === 0) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Stack, _extends({
    className: className,
    ref: ref,
    align: "flex-start",
    spacing: 4
  }, rest), ranges.map((range, index) => {
    const {
      value,
      closeOverlay,
      label,
      ...rest
    } = range;
    const disabled = disableShortcut === null || disableShortcut === void 0 ? void 0 : disableShortcut(value);
    const handleClickShortcut = event => {
      if (disabled) {
        return;
      }
      onShortcutClick === null || onShortcutClick === void 0 || onShortcutClick(range, closeOverlay !== false ? true : false, event);
    };
    return /*#__PURE__*/React.createElement(Button, _extends({
      appearance: "link",
      size: "sm",
      key: index,
      disabled: disabled,
      onClick: handleClickShortcut
    }, rest), hasLocaleKey(label) && typeof label === 'string' ? locale === null || locale === void 0 ? void 0 : locale[label] : label);
  }));
});
export default PredefinedRanges;