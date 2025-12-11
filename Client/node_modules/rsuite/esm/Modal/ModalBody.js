'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import IconButton from "../IconButton/index.js";
import Close from '@rsuite/icons/Close';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { ModalContext } from "./ModalContext.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
const ModalBody = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'modal-body',
    className,
    style,
    children,
    ...rest
  } = props;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const context = useContext(ModalContext);
  const {
    getBodyStyles,
    closeButton,
    dialogId,
    onModalClose
  } = context || {};
  const bodyStyles = getBodyStyles === null || getBodyStyles === void 0 ? void 0 : getBodyStyles();
  let buttonElement = null;
  if (closeButton) {
    buttonElement = typeof closeButton === 'boolean' ? /*#__PURE__*/React.createElement(IconButton, {
      icon: /*#__PURE__*/React.createElement(Close, null),
      appearance: "subtle",
      size: "sm",
      className: prefix('close'),
      onClick: onModalClose
    }) : closeButton;
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    id: dialogId ? `${dialogId}-description` : undefined,
    ref: ref,
    style: mergeStyles(bodyStyles, style),
    className: classes
  }), buttonElement, children);
});
ModalBody.displayName = 'ModalBody';
export default ModalBody;