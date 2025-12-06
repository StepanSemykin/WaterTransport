'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import CloseButton from "../internals/CloseButton/index.js";
import IconButton from "../IconButton/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef, createChainedFunction } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { ModalContext } from "./ModalContext.js";
const ModalHeader = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'modal-header',
    className,
    closeButton = true,
    children,
    onClose,
    ...rest
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const context = useContext(ModalContext);
  const {
    onModalClose
  } = context || {};
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }), closeButton && /*#__PURE__*/React.createElement(CloseButton, {
    as: IconButton,
    className: prefix('close'),
    onClick: createChainedFunction(onClose, onModalClose)
  }), children);
});
ModalHeader.displayName = 'ModalHeader';
export default ModalHeader;