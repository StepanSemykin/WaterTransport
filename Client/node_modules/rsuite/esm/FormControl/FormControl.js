'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Input from "../Input/index.js";
import FormErrorMessage from "../FormErrorMessage/index.js";
import Toggle from "../Toggle/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { useFormGroup } from "../FormGroup/index.js";
import { useFormControl } from "../useFormControl/index.js";

/**
 * Props that FormControl passes to its accepter
 */

/**
 * The `<Form.Control>` component is used to wrap the components that need to be validated.
 * @see https://rsuitejs.com/components/form/
 */
const FormControl = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('FormControl', props);
  const {
    as,
    accepter: AccepterComponent = Input,
    classPrefix = 'form-control',
    name,
    value,
    readOnly,
    plaintext,
    disabled,
    onChange: propsOnChange,
    onBlur: propsOnBlur,
    defaultValue,
    checkTrigger,
    errorMessage,
    errorPlacement = 'bottomStart',
    checkAsync,
    shouldResetWithUnmount,
    rule,
    id,
    ...rest
  } = propsWithDefaults;
  const {
    controlId,
    helpTextId,
    labelId,
    errorMessageId
  } = useFormGroup(id);

  // Use the useFormControl hook to handle form control logic
  const {
    value: fieldValue,
    error: fieldError,
    plaintext: contextPlaintext,
    readOnly: contextReadOnly,
    disabled: contextDisabled,
    onChange: handleFieldChange,
    onBlur: handleFieldBlur
  } = useFormControl({
    name,
    value,
    checkTrigger,
    errorMessage,
    checkAsync,
    shouldResetWithUnmount,
    rule
  });

  // Combine props and context values
  const resolvedReadOnly = readOnly !== null && readOnly !== void 0 ? readOnly : contextReadOnly;
  const resolvedPlaintext = plaintext !== null && plaintext !== void 0 ? plaintext : contextPlaintext;
  const resolvedDisabled = disabled !== null && disabled !== void 0 ? disabled : contextDisabled;
  const {
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = withPrefix('wrapper');

  // Handle onChange with both hook's implementation and prop callback
  const handleChange = (value, event) => {
    handleFieldChange(value, event);
    propsOnChange === null || propsOnChange === void 0 || propsOnChange(value, event);
  };

  // Handle onBlur with both hook's implementation and prop callback
  const handleBlur = event => {
    handleFieldBlur(); // onBlur doesn't take parameters in the hook
    propsOnBlur === null || propsOnBlur === void 0 || propsOnBlur(event);
  };

  // Toggle component is a special case that uses `checked` and `defaultChecked` instead of `value` and `defaultValue` props.
  const valueKey = AccepterComponent === Toggle ? 'checked' : 'value';
  const accepterProps = {
    // need to distinguish between undefined and null
    [valueKey]: fieldValue === undefined ? defaultValue : fieldValue
  };
  const hasError = Boolean(fieldError);
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    className: classes,
    ref: ref,
    "data-testid": "form-control-wrapper"
  }, /*#__PURE__*/React.createElement(AccepterComponent, _extends({
    id: controlId,
    "aria-labelledby": labelId,
    "aria-describedby": helpTextId,
    "aria-invalid": hasError || undefined,
    "aria-errormessage": hasError ? errorMessageId : undefined
  }, accepterProps, rest, {
    readOnly: resolvedReadOnly,
    plaintext: resolvedPlaintext,
    disabled: resolvedDisabled,
    name: name,
    onChange: handleChange,
    onBlur: handleBlur
  })), /*#__PURE__*/React.createElement(FormErrorMessage, {
    id: errorMessageId,
    role: "alert",
    "aria-relevant": "all",
    show: hasError,
    className: prefix`message-wrapper`,
    placement: errorPlacement
  }, fieldError));
});
FormControl.displayName = 'FormControl';
export default FormControl;