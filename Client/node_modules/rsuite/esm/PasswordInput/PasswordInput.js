'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Input from "../Input/index.js";
import InputGroup from "../InputGroup/index.js";
import EyeCloseIcon from '@rsuite/icons/EyeClose';
import VisibleIcon from '@rsuite/icons/Visible';
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
const PasswordInput = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PasswordInput', props);
  const {
    classPrefix = 'password-input',
    className,
    visible: controlVisible,
    size,
    defaultVisible,
    value,
    defaultValue,
    placeholder,
    id,
    name,
    readOnly,
    inputRef,
    startIcon,
    endIcon,
    onChange,
    onVisibleChange,
    renderVisibilityIcon,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const [visible, setVisible] = useControlled(controlVisible, defaultVisible);
  const classes = merge(className, withPrefix());
  const handleToggleVisibility = useEventCallback(() => {
    setVisible(!visible);
    onVisibleChange === null || onVisibleChange === void 0 || onVisibleChange(!visible);
  });
  return /*#__PURE__*/React.createElement(InputGroup, _extends({
    inside: true,
    ref: ref,
    size: size,
    className: classes
  }, rest), startIcon && /*#__PURE__*/React.createElement(InputGroup.Addon, null, startIcon), /*#__PURE__*/React.createElement(Input, {
    type: visible ? 'text' : 'password',
    value: value,
    defaultValue: defaultValue,
    onChange: onChange,
    autoComplete: "off",
    placeholder: placeholder,
    readOnly: readOnly,
    name: name,
    id: id,
    inputRef: inputRef
  }), endIcon ? /*#__PURE__*/React.createElement(InputGroup.Addon, null, endIcon) : /*#__PURE__*/React.createElement(InputGroup.Button, {
    tabIndex: -1,
    onClick: handleToggleVisibility,
    "aria-label": "Toggle password visibility"
  }, (renderVisibilityIcon === null || renderVisibilityIcon === void 0 ? void 0 : renderVisibilityIcon(visible !== null && visible !== void 0 ? visible : false)) || (visible ? /*#__PURE__*/React.createElement(EyeCloseIcon, null) : /*#__PURE__*/React.createElement(VisibleIcon, null))));
});
PasswordInput.displayName = 'PasswordInput';
export default PasswordInput;