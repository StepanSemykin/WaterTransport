'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Close from '@rsuite/icons/Close';
import IconButton from "../../IconButton/index.js";
import { forwardRef } from "../utils/index.js";
import { useStyles, useCustom } from "../hooks/index.js";
/**
 * Close button for components such as Message and Notification.
 */
const CloseButton = forwardRef((props, ref) => {
  const {
    as: Component = 'button',
    classPrefix = 'btn-close',
    className,
    locale: overrideLocale,
    ...rest
  } = props;
  const {
    getLocale
  } = useCustom();
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const {
    closeLabel
  } = getLocale('CloseButton', overrideLocale);
  const classes = merge(className, withPrefix());
  if (Component === IconButton) {
    return /*#__PURE__*/React.createElement(IconButton, _extends({
      icon: /*#__PURE__*/React.createElement(Close, null),
      ref: ref,
      className: classes,
      "aria-label": closeLabel,
      appearance: "subtle",
      size: "sm"
    }, rest));
  }
  return /*#__PURE__*/React.createElement(Component, _extends({
    type: "button",
    ref: ref,
    className: classes,
    "aria-label": closeLabel
  }, rest), /*#__PURE__*/React.createElement(Close, null));
});
CloseButton.displayName = 'CloseButton';
export default CloseButton;