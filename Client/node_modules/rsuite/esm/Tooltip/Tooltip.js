'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The `Tooltip` component is used to describe a element.
 *
 * @see https://rsuitejs.com/components/tooltip
 */
const Tooltip = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Tooltip', props);
  const {
    as,
    className,
    classPrefix = 'tooltip',
    children,
    style,
    visible,
    arrow = true,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    arrow
  }));
  const styles = useMemo(() => mergeStyles(style, {
    ['--rs-opacity']: visible ? 1 : undefined
  }), [visible, style]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "tooltip"
  }, rest, {
    ref: ref,
    className: classes,
    style: styles
  }), children);
});
Tooltip.displayName = 'Tooltip';
export default Tooltip;