'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import Box from "../internals/Box/index.js";
import { ModalContext } from "./ModalContext.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
const ModalTitle = forwardRef((props, ref) => {
  const {
    as = 'h4',
    classPrefix = 'modal-title',
    className,
    role,
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const context = useContext(ModalContext);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    id: context ? `${context.dialogId}-title` : undefined
  }, rest, {
    role: role,
    ref: ref,
    className: classes
  }));
});
ModalTitle.displayName = 'Modal.Title';
export default ModalTitle;