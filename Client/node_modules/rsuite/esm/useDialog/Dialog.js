'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useRef, useEffect, useState } from 'react';
import Modal from "../Modal/index.js";
import Button from "../Button/index.js";
import Input from "../Input/index.js";
import Text from "../Text/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { VStack } from "../Stack/index.js";
import { useCustom } from "../internals/hooks/index.js";
const severityMap = {
  info: 'blue',
  success: 'green',
  warning: 'orange',
  error: 'red'
};
const Dialog = forwardRef((props, ref) => {
  const {
    getLocale,
    propsWithDefaults
  } = useCustom('Dialog', props);
  const locale = getLocale('Dialog');
  const {
    type,
    title = type === 'alert' ? locale.alert : locale.confirm,
    content,
    okText = locale.ok,
    cancelText = locale.cancel,
    severity,
    defaultValue = '',
    validate,
    onClose,
    ...rest
  } = propsWithDefaults;
  const [isOpen, setIsOpen] = useState(true);
  const [validationError, setValidationError] = useState();
  const inputRef = useRef(null);
  const inputValue = useRef(defaultValue);
  const showCancelButton = type === 'confirm' || type === 'prompt';
  useEffect(() => {
    if (type === 'prompt' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [type]);
  const handleCancel = useCallback(result => {
    setIsOpen(false);
    setTimeout(() => {
      onClose === null || onClose === void 0 || onClose(result);
    }, 300);
  }, [onClose]);
  const handleConfirm = useCallback(() => {
    if (type === 'prompt') {
      const value = inputValue.current;
      if (validate) {
        const [isValid, errorMessage] = validate(value);
        if (!isValid) {
          setValidationError(errorMessage || 'Invalid input');
          return;
        }
      }
      handleCancel(value);
    } else {
      handleCancel(true);
    }
  }, [type, inputValue, validate, handleCancel]);
  const handleClose = useCallback(() => handleCancel(false), [handleCancel]);
  const handleInputKeyDown = useCallback(event => {
    if (event.key === 'Enter') {
      handleConfirm();
    }
  }, [handleConfirm]);
  const handlePromptInputChange = useCallback(value => {
    inputValue.current = value;
    if (validationError) setValidationError(undefined);
  }, [validationError]);
  return /*#__PURE__*/React.createElement(Modal, _extends({
    ref: ref,
    open: isOpen,
    size: "xs",
    backdrop: "static"
  }, rest), /*#__PURE__*/React.createElement(Modal.Header, {
    closeButton: false
  }, /*#__PURE__*/React.createElement(Modal.Title, null, title)), /*#__PURE__*/React.createElement(Modal.Body, null, /*#__PURE__*/React.createElement(VStack, null, type === 'prompt' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("label", {
    htmlFor: "rs-prompt-input"
  }, content), /*#__PURE__*/React.createElement(Input, {
    w: "100%",
    required: true,
    ref: inputRef,
    id: "rs-prompt-input",
    defaultValue: defaultValue,
    onChange: handlePromptInputChange,
    onKeyDown: handleInputKeyDown
  }), validationError && /*#__PURE__*/React.createElement(Text, {
    color: "red"
  }, validationError)) : content)), /*#__PURE__*/React.createElement(Modal.Footer, null, showCancelButton && /*#__PURE__*/React.createElement(Button, {
    onClick: handleClose,
    appearance: "subtle"
  }, cancelText), /*#__PURE__*/React.createElement(Button, {
    appearance: "primary",
    onClick: handleConfirm,
    color: severity ? severityMap[severity] : undefined
  }, okText)));
});
export default Dialog;