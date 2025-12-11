'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
const ModalDialog = forwardRef((props, ref) => {
  const {
    as,
    style,
    children,
    dialogClassName,
    dialogStyle,
    classPrefix = 'modal',
    className,
    size,
    ...rest
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(size));
  const dialogClasses = merge(dialogClassName, prefix('dialog'));
  const modalStyle = mergeStyles({
    display: 'block'
  }, style);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "dialog",
    "aria-modal": true,
    ref: ref,
    className: classes,
    style: modalStyle
  }, rest), /*#__PURE__*/React.createElement("div", {
    role: "document",
    className: dialogClasses,
    style: dialogStyle
  }, children));
});
ModalDialog.displayName = 'ModalDialog';
export default ModalDialog;