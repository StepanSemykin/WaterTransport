'use client';
import { useRef, useCallback } from 'react';
import omit from 'lodash/omit';
import set from 'lodash/set';
import { useControlled, useEventCallback } from "../../internals/hooks/index.js";
import { nameToPath } from "../../useFormControl/utils/nameToPath.js";
export default function useFormValidate(_formError, props) {
  const {
    formValue,
    getCombinedModel,
    onCheck,
    onError,
    nestedField
  } = props;
  const [realFormError, setFormError] = useControlled(_formError, {});
  const checkOptions = {
    nestedObject: nestedField
  };
  const realFormErrorRef = useRef(realFormError);
  realFormErrorRef.current = realFormError;

  /**
   * Validate the form data and return a boolean.
   * The error message after verification is returned in the callback.
   * @param callback
   */
  const check = useEventCallback(callback => {
    const formError = {};
    let errorCount = 0;
    const model = getCombinedModel();
    const checkField = (key, type, value, formErrorObj) => {
      model.setSchemaOptionsForAllType(formValue || {});
      const checkResult = type.check(value, formValue, key);
      if (checkResult.hasError === true) {
        errorCount += 1;
        formErrorObj[key] = (checkResult === null || checkResult === void 0 ? void 0 : checkResult.errorMessage) || checkResult;
      }

      // Check nested object
      if (type !== null && type !== void 0 && type.objectTypeSchemaSpec) {
        Object.entries(type.objectTypeSchemaSpec).forEach(([nestedKey, nestedType]) => {
          formErrorObj[key] = formErrorObj[key] || {
            object: {}
          };
          checkField(nestedKey, nestedType, value === null || value === void 0 ? void 0 : value[nestedKey], formErrorObj[key].object);
        });
      }
    };
    Object.entries(model.getSchemaSpec()).forEach(([key, type]) => {
      checkField(key, type, formValue[key], formError);
    });
    setFormError(formError);
    onCheck === null || onCheck === void 0 || onCheck(formError);
    callback === null || callback === void 0 || callback(formError);
    if (errorCount > 0) {
      onError === null || onError === void 0 || onError(formError);
      return false;
    }
    return true;
  });
  const checkFieldForNextValue = useEventCallback((fieldName, nextValue, callback) => {
    const model = getCombinedModel();
    const resultOfCurrentField = model.checkForField(fieldName, nextValue, checkOptions);
    let nextFormError = {
      ...realFormError
    };
    /**
     * when using proxy of schema-typed, we need to use getCheckResult to get all errors,
     * but if nestedField is used, it is impossible to distinguish whether the nested object has an error here,
     * so nestedField does not support proxy here
     */
    if (nestedField) {
      nextFormError = set(nextFormError, nameToPath(fieldName), resultOfCurrentField);
      setFormError(nextFormError);
      onCheck === null || onCheck === void 0 || onCheck(nextFormError);
      callback === null || callback === void 0 || callback(resultOfCurrentField);
      if (resultOfCurrentField.hasError) {
        onError === null || onError === void 0 || onError(nextFormError);
      }
      return !resultOfCurrentField.hasError;
    } else {
      const allResults = model.getCheckResult();
      let hasError = false;
      Object.keys(allResults).forEach(key => {
        const currentResult = allResults[key];
        if (currentResult.hasError) {
          nextFormError[key] = currentResult.errorMessage || currentResult;
          hasError = true;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const {
            [key]: _,
            ...rest
          } = nextFormError;
          nextFormError = rest;
        }
      });
      setFormError(nextFormError);
      onCheck === null || onCheck === void 0 || onCheck(nextFormError);
      callback === null || callback === void 0 || callback(resultOfCurrentField);
      if (hasError) {
        onError === null || onError === void 0 || onError(nextFormError);
      }
      return !hasError;
    }
  });
  /**
   * Check the data field
   * @param fieldName
   * @param callback
   */
  const checkForField = useEventCallback((fieldName, callback) => {
    return checkFieldForNextValue(fieldName, formValue || {}, callback);
  });

  /**
   * Check form data asynchronously and return a Promise
   */
  const checkAsync = useEventCallback(() => {
    const promises = [];
    const keys = [];
    const model = getCombinedModel();
    Object.keys(model.getSchemaSpec()).forEach(key => {
      keys.push(key);
      promises.push(model.checkForFieldAsync(key, formValue || {}, checkOptions));
    });
    return Promise.all(promises).then(values => {
      const formError = {};
      let errorCount = 0;
      for (let i = 0; i < values.length; i++) {
        if (values[i].hasError) {
          errorCount += 1;
          formError[keys[i]] = values[i].errorMessage;
        }
      }
      onCheck === null || onCheck === void 0 || onCheck(formError);
      setFormError(formError);
      if (errorCount > 0) {
        onError === null || onError === void 0 || onError(formError);
      }
      return {
        hasError: errorCount > 0,
        formError
      };
    });
  });
  const checkFieldAsyncForNextValue = useEventCallback((fieldName, nextValue) => {
    const model = getCombinedModel();
    return model.checkForFieldAsync(fieldName, nextValue, checkOptions).then(resultOfCurrentField => {
      let nextFormError = {
        ...realFormError
      };
      /**
       * when using proxy of schema-typed, we need to use getCheckResult to get all errors,
       * but if nestedField is used, it is impossible to distinguish whether the nested object has an error here,
       * so nestedField does not support proxy here
       */

      if (nestedField) {
        nextFormError = set(nextFormError, nameToPath(fieldName), resultOfCurrentField);
        onCheck === null || onCheck === void 0 || onCheck(nextFormError);
        setFormError(nextFormError);
        if (resultOfCurrentField.hasError) {
          onError === null || onError === void 0 || onError(nextFormError);
        }
        return resultOfCurrentField;
      } else {
        const allResults = model.getCheckResult();
        let hasError = false;
        Object.keys(allResults).forEach(key => {
          const currentResult = allResults[key];
          if (currentResult.hasError) {
            nextFormError[key] = currentResult.errorMessage || currentResult;
            hasError = true;
          } else {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const {
              [key]: _,
              ...rest
            } = nextFormError;
            nextFormError = rest;
          }
        });
        setFormError(nextFormError);
        onCheck === null || onCheck === void 0 || onCheck(nextFormError);
        if (hasError) {
          onError === null || onError === void 0 || onError(nextFormError);
        }
        return resultOfCurrentField;
      }
    });
  });

  /**
   * Asynchronously check form fields and return Promise
   * @param fieldName
   */
  const checkForFieldAsync = useEventCallback(fieldName => {
    return checkFieldAsyncForNextValue(fieldName, formValue || {});
  });
  const onRemoveError = useCallback(name => {
    /**
     * when this function is called when the children component is unmount,
     * it's an old render frame so use Ref to get future error
     */
    const formError = omit(realFormErrorRef.current, [nestedField ? nameToPath(name) : name]);
    realFormErrorRef.current = formError;
    setFormError(formError);
    onCheck === null || onCheck === void 0 || onCheck(formError);
    return formError;
  }, [nestedField, onCheck, setFormError]);
  const cleanErrors = useEventCallback(() => {
    setFormError({});
  });
  const resetErrors = useEventCallback((formError = {}) => {
    setFormError(formError);
  });
  const cleanErrorForField = useEventCallback(fieldName => {
    setFormError(omit(realFormError, [nestedField ? nameToPath(fieldName) : fieldName]));
  });
  return {
    formError: realFormError,
    check,
    checkForField,
    checkFieldForNextValue,
    checkAsync,
    checkForFieldAsync,
    checkFieldAsyncForNextValue,
    cleanErrors,
    resetErrors,
    cleanErrorForField,
    onRemoveError
  };
}