'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import StyledBox from "../internals/StyledBox/index.js";
import { forwardRef, getSizeStyle, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The Divider component is used to separate content.
 * @see https://rsuitejs.com/components/divider
 */
const Divider = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Divider', props);
  const {
    as,
    appearance,
    className,
    classPrefix = 'divider',
    children,
    color,
    label = children,
    labelPlacement,
    vertical,
    spacing,
    style,
    size,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const styles = mergeStyles(style, getSizeStyle(spacing, 'divider', 'spacing'));
  return /*#__PURE__*/React.createElement(StyledBox, _extends({
    as: as,
    name: "divider",
    role: "separator",
    ref: ref,
    className: classes,
    style: styles,
    size: size,
    color: color,
    "data-appearance": appearance,
    "data-orientation": vertical ? 'vertical' : 'horizontal',
    "data-with-label": label ? 'true' : undefined,
    "data-placement": labelPlacement
  }, rest), label);
});
Divider.displayName = 'Divider';
export default Divider;