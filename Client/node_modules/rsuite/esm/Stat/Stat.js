'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import StatLabel from "./StatLabel.js";
import StatValue from "./StatValue.js";
import StatValueUnit from "./StatValueUnit.js";
import StatHelpText from "./StatHelpText.js";
import StatTrend from "./StatTrend.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const Subcomponents = {
  Label: StatLabel,
  Value: StatValue,
  Trend: StatTrend,
  ValueUnit: StatValueUnit,
  HelpText: StatHelpText
};
const Stat = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Stat', props);
  const {
    as,
    classPrefix = 'stat',
    className,
    children,
    bordered,
    icon,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    bordered
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    className: classes,
    ref: ref
  }, rest), icon && /*#__PURE__*/React.createElement("div", {
    className: prefix('icon')
  }, icon), /*#__PURE__*/React.createElement("dl", {
    className: prefix('body')
  }, children));
}, Subcomponents);
Stat.displayName = 'Stat';
export default Stat;