'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../Box/index.js";
import { forwardRef, mergeStyles, getCssValue, getColorStyle } from "../utils/index.js";
import { useStyles } from "../hooks/index.js";
/**
 * Burger (hamburger menu) button for toggling navigation menus.
 */
const Burger = forwardRef((props, ref) => {
  const {
    as = 'button',
    classPrefix = 'burger',
    className,
    color,
    open = false,
    lineThickness,
    style,
    ...rest
  } = props;
  const {
    withPrefix,
    merge,
    cssVar,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const mergedStyle = mergeStyles(style, cssVar('thickness', getCssValue(lineThickness)), getColorStyle(color, 'burger'));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "aria-pressed": open,
    "data-opened": open,
    style: mergedStyle
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: prefix('line')
  }));
});
Burger.displayName = 'Burger';
export default Burger;