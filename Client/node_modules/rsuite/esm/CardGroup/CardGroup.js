'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef, getCssValue, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const CardGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('CardGroup', props);
  const {
    as,
    classPrefix = 'card-group',
    className,
    children,
    columns,
    spacing = 16,
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
CardGroup.displayName = 'CardGroup';
export default CardGroup;