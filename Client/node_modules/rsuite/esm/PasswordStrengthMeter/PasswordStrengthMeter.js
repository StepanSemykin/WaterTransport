'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import Text from "../Text/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const PasswordStrengthMeter = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PasswordStrengthMeter', props);
  const {
    classPrefix = 'password-strength-meter',
    className,
    level = 0,
    max = 4,
    label,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    ref: ref,
    className: classes
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: prefix('bar')
  }, [...Array.from({
    length: max
  })].map((_, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    "data-active": idx <= level,
    className: prefix('segment')
  }))), label && /*#__PURE__*/React.createElement(Text, {
    as: "span",
    muted: true,
    size: "xs"
  }, label));
});
PasswordStrengthMeter.displayName = 'PasswordStrengthMeter';
export default PasswordStrengthMeter;