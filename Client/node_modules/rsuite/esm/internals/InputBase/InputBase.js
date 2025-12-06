'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import Plaintext from "../Plaintext/index.js";
import Box from "../Box/index.js";
import { forwardRef, mergeRefs, createChainedFunction } from "../utils/index.js";
import { useFormGroup } from "../../FormGroup/index.js";
import { InputGroupContext } from "../../InputGroup/index.js";
import { KEY_VALUES } from "../constants/index.js";
import { useStyles } from "../hooks/index.js";
/**
 * The `InputBase` component serves as the base for both Input and Textarea components.
 * It provides common functionality for both components.
 */
const InputBase = forwardRef((props, ref) => {
  const {
    as,
    className,
    classPrefix,
    disabled,
    value,
    defaultValue,
    inputRef,
    id,
    size,
    plaintext,
    placeholder,
    readOnly,
    inputProps,
    onPressEnter,
    onFocus,
    onBlur,
    onKeyDown,
    onChange,
    ...rest
  } = props;
  const inputGroup = useContext(InputGroupContext);
  const {
    controlId
  } = useFormGroup();
  const handleKeyDown = event => {
    if (event.key === KEY_VALUES.ENTER) {
      onPressEnter === null || onPressEnter === void 0 || onPressEnter(event);
    }
    onKeyDown === null || onKeyDown === void 0 || onKeyDown(event);
  };
  const handleChange = event => {
    var _event$target;
    onChange === null || onChange === void 0 || onChange((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.value, event);
  };
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix || 'input');
  const classes = merge(className, withPrefix({
    plaintext
  }));

  // Make the component display in plain text,
  // and display default characters when there is no value.
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, {
      ref: ref,
      localeKey: "unfilled",
      placeholder: placeholder
    }, typeof value === 'undefined' ? defaultValue : value);
  }
  const inputable = !disabled && !readOnly;
  const eventProps = {};
  if (inputable) {
    eventProps.onChange = handleChange;
    eventProps.onKeyDown = handleKeyDown;
    eventProps.onFocus = createChainedFunction(onFocus, inputGroup === null || inputGroup === void 0 ? void 0 : inputGroup.onFocus);
    eventProps.onBlur = createChainedFunction(onBlur, inputGroup === null || inputGroup === void 0 ? void 0 : inputGroup.onBlur);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: mergeRefs(ref, inputRef),
    className: classes,
    id: id || controlId,
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    readOnly: readOnly,
    placeholder: placeholder,
    "data-size": size
  }, inputProps, eventProps, rest));
});
InputBase.displayName = 'InputBase';
export default InputBase;