'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Button from "../Button/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The `IconButton` component is used to specify a button with icon.
 * @see https://rsuitejs.com/components/button
 */
const IconButton = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('IconButton', props);
  const {
    circle,
    children,
    className,
    classPrefix = 'btn-icon',
    placement = 'start',
    icon,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Button, _extends({}, rest, {
    ref: ref,
    className: classes,
    "data-shape": circle ? 'circle' : undefined,
    "data-placement": placement,
    "data-with-text": typeof children !== 'undefined' || undefined
  }), icon, children);
});
IconButton.displayName = 'IconButton';
export default IconButton;