'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { FormattedNumber } from "../internals/intl/FormattedNumber.js";
const StatValue = forwardRef((props, ref) => {
  const {
    as = 'dd',
    classPrefix = 'stat-value',
    className,
    children,
    value,
    formatOptions,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), value && /*#__PURE__*/React.createElement(FormattedNumber, {
    value: value,
    formatOptions: formatOptions
  }), children);
});
StatValue.displayName = 'StatValue';
export default StatValue;