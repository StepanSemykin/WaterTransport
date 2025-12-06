'use client';
import { useCallback, useContext } from 'react';
import { FormValueContext, useFormContext } from "../Form/FormContext.js";
import { useWillUnmount, useEventCallback } from "../internals/hooks/index.js";
import { useRegisterModel } from "./hooks/useRegisterModel.js";
import { useField } from "./hooks/useField.js";
/**
 * Hook for accessing form control functionality.
 * Must be used within a Form component.
 *
 * @param props The form control properties
 * @returns Form control functionality for the specified field
 */
export function useFormControl(props) {
  const {
    name,
    value: controlledValue,
    checkTrigger,
    errorMessage,
    checkAsync = false,
    shouldResetWithUnmount = false,
    rule
  } = props;
  const {
    readOnly,
    plaintext,
    disabled,
    errorFromContext,
    formError,
    nestedField,
    onFieldChange,
    removeFieldValue,
    removeFieldError,
    checkTrigger: contextCheckTrigger,
    checkFieldForNextValue,
    checkFieldAsyncForNextValue
  } = useFormContext();

  // Throw an error if not used within a Form component
  if (!onFieldChange) {
    console.error(`<useFormControl> must be used inside a component decorated with <Form>. And need to update React to 16.6.0 +.`);
  }
  const formValue = useContext(FormValueContext);

  // Register form field model
  useRegisterModel(name, rule);

  // Cleanup on unmount if shouldResetWithUnmount is true
  useWillUnmount(() => {
    if (shouldResetWithUnmount) {
      removeFieldValue === null || removeFieldValue === void 0 || removeFieldValue(name);
      removeFieldError === null || removeFieldError === void 0 || removeFieldError(name);
    }
  });

  // Use the useField hook to handle field value and error
  const {
    fieldValue: value,
    fieldError: error,
    setFieldValue
  } = useField({
    name,
    errorMessage,
    formValue,
    formError,
    value: controlledValue,
    nestedField,
    errorFromContext
  });
  const trigger = checkTrigger || contextCheckTrigger;

  // Handler for field check (validation)
  const onCheck = useEventCallback(value => {
    // Don't perform validation when checkTrigger is null
    if (trigger === null) {
      return;
    }
    const nextFormValue = setFieldValue(name, value);
    if (checkAsync) {
      checkFieldAsyncForNextValue === null || checkFieldAsyncForNextValue === void 0 || checkFieldAsyncForNextValue(name, nextFormValue);
    } else {
      checkFieldForNextValue === null || checkFieldForNextValue === void 0 || checkFieldForNextValue(name, nextFormValue);
    }
  });

  // Handler for field change
  const onChange = useEventCallback((value, event) => {
    if (trigger === 'change') {
      onCheck(value);
    }
    onFieldChange === null || onFieldChange === void 0 || onFieldChange(name, value, event);
  });

  // Handler for field blur
  const onBlur = useEventCallback(() => {
    if (trigger === 'blur') {
      onCheck(value);
    }
  });

  /**
   * Directly sets the field value without triggering validation or onChange events.
   * Useful for programmatically updating field values.
   * @param value The new value to set
   * @param shouldValidate Whether to trigger validation (defaults to false)
   */
  const setValue = useCallback((value, shouldValidate = false) => {
    const nextFormValue = setFieldValue(name, value);
    onFieldChange === null || onFieldChange === void 0 || onFieldChange(name, value);
    if (shouldValidate && trigger !== null) {
      if (checkAsync) {
        checkFieldAsyncForNextValue === null || checkFieldAsyncForNextValue === void 0 || checkFieldAsyncForNextValue(name, nextFormValue);
      } else {
        checkFieldForNextValue === null || checkFieldForNextValue === void 0 || checkFieldForNextValue(name, nextFormValue);
      }
    }
  }, [name, setFieldValue, trigger, checkAsync, checkFieldAsyncForNextValue, checkFieldForNextValue]);
  return {
    value,
    error,
    plaintext,
    readOnly,
    disabled,
    onChange,
    onCheck,
    onBlur,
    setValue
  };
}
export default useFormControl;