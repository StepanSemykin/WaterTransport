'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef, getCssValue, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const StatGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('StatGroup', props);
  const {
    as,
    classPrefix = 'stat-group',
    className,
    children,
    columns,
    spacing = 6,
    style,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix,
    cssVar
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const styles = mergeStyles(style, cssVar('columns', columns), cssVar('spacing', spacing, getCssValue));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles
  }, rest), children);
});
StatGroup.displayName = 'StatGroup';
export default StatGroup;