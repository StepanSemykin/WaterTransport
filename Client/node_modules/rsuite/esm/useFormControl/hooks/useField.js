'use client';
import get from 'lodash/get';
import set from 'lodash/set';
import { isValidElement, useCallback, useMemo } from 'react';
import { nameToPath } from "../utils/nameToPath.js";
function getErrorMessage(error) {
  var _error$array;
  if (typeof error === 'string') {
    return error;
  }

  /**
   * When using some components as the field, such as TagInput, and using `ArrayType().of` as the validation rule,
   * the error object won't contain the errorMessage directly. @see https://github.com/rsuite/rsuite/issues/3866
   */
  if (error !== null && error !== void 0 && error.array && ((_error$array = error.array) === null || _error$array === void 0 ? void 0 : _error$array.length) > 0) {
    var _error$array$find;
    return (_error$array$find = error.array.find(item => item.hasError)) === null || _error$array$find === void 0 ? void 0 : _error$array$find.errorMessage;
  }
  if (/*#__PURE__*/isValidElement(error)) {
    return error;
  }
  return error === null || error === void 0 ? void 0 : error.errorMessage;
}
export function useField(props) {
  const {
    name,
    formValue,
    formError,
    value,
    nestedField,
    errorMessage,
    errorFromContext
  } = props;
  const fieldValue = useMemo(() => {
    if (typeof value !== 'undefined') {
      return value;
    }
    return nestedField ? get(formValue, name) : formValue === null || formValue === void 0 ? void 0 : formValue[name];
  }, [formValue, name, nestedField, value]);
  const fieldError = useMemo(() => {
    if (typeof errorMessage !== 'undefined' || !errorFromContext) {
      return errorMessage;
    }
    if (nestedField) {
      return getErrorMessage(get(formError, nameToPath(name)));
    }
    const fieldError = formError === null || formError === void 0 ? void 0 : formError[name];
    if (typeof fieldError === 'string') {
      return fieldError;
    }
    return getErrorMessage(fieldError);
  }, [errorFromContext, errorMessage, formError, name, nestedField]);
  const setFieldValue = useCallback((fieldName, fieldValue) => {
    if (nestedField) {
      return set({
        ...formValue
      }, fieldName, fieldValue);
    }
    return {
      ...formValue,
      [fieldName]: fieldValue
    };
  }, [formValue, nestedField]);
  return {
    fieldValue,
    fieldError,
    setFieldValue
  };
}