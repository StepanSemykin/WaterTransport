'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import DatePicker from "../DatePicker/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useCustom } from "../internals/hooks/index.js";
const TimePicker = forwardRef((props, ref) => {
  const {
    propsWithDefaults,
    getLocale
  } = useCustom('TimePicker', props);
  const locale = getLocale('DateTimeFormats');
  const defaultRanges = useMemo(() => [{
    label: locale === null || locale === void 0 ? void 0 : locale.now,
    value: () => new Date()
  }], [locale]);
  return /*#__PURE__*/React.createElement(DatePicker, _extends({
    ref: ref,
    format: locale === null || locale === void 0 ? void 0 : locale.shortTimeFormat,
    ranges: defaultRanges
  }, propsWithDefaults));
});
TimePicker.displayName = 'TimePicker';
export default TimePicker;