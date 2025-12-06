'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import DateRangePicker from "../DateRangePicker/index.js";
import { useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
const defaultRanges = [];
const TimeRangePicker = forwardRef((props, ref) => {
  const {
    propsWithDefaults,
    getLocale
  } = useCustom('TimeRangePicker', props);
  const {
    shortTimeFormat
  } = getLocale('DateTimeFormats');
  return /*#__PURE__*/React.createElement(DateRangePicker, _extends({
    ref: ref,
    showHeader: false,
    format: shortTimeFormat,
    ranges: defaultRanges
  }, propsWithDefaults));
});
TimeRangePicker.displayName = 'TimeRangePicker';
export default TimeRangePicker;