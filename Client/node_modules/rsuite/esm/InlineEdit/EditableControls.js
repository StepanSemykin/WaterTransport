'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import CheckIcon from '@rsuite/icons/Check';
import CloseIcon from '@rsuite/icons/Close';
import IconButton from "../IconButton/index.js";
import Stack from "../Stack/index.js";
const EditableControls = /*#__PURE__*/React.forwardRef(function EditableControls(props, ref) {
  const {
    onSave,
    onCancel,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Stack, _extends({
    ref: ref
  }, rest), /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(CheckIcon, null),
    "aria-label": "Save",
    onClick: onSave
  }), /*#__PURE__*/React.createElement(IconButton, {
    size: "sm",
    icon: /*#__PURE__*/React.createElement(CloseIcon, null),
    "aria-label": "Cancel",
    onClick: onCancel
  }));
});
export default EditableControls;