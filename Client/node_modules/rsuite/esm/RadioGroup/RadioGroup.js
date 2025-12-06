'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import Plaintext from "../internals/Plaintext/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
export const RadioContext = /*#__PURE__*/React.createContext(void 0);

/**
 * The `RadioGroup` component is used to group a collection of `Radio` components.
 * @see https://rsuitejs.com/components/radio/#radio-group
 */
const RadioGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('RadioGroup', props);
  const {
    as,
    className,
    inline,
    children,
    classPrefix = 'radio-group',
    value: valueProp,
    defaultValue,
    appearance = 'default',
    name,
    plaintext,
    disabled,
    readOnly,
    onChange,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [value, setValue, isControlled] = useControlled(valueProp, defaultValue);
  const handleChange = useEventCallback((nextValue, event) => {
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue !== null && nextValue !== void 0 ? nextValue : '', event);
  });
  const contextValue = useMemo(() => ({
    inline,
    name,
    value: typeof value === 'undefined' ? null : value,
    controlled: isControlled,
    plaintext,
    disabled,
    readOnly,
    onChange: handleChange
  }), [disabled, handleChange, inline, isControlled, name, plaintext, readOnly, value]);
  return /*#__PURE__*/React.createElement(RadioContext.Provider, {
    value: contextValue
  }, plaintext ? /*#__PURE__*/React.createElement(Plaintext, _extends({
    ref: ref,
    localeKey: "notSelected"
  }, rest), value ? children : null) : /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "radiogroup"
  }, rest, {
    ref: ref,
    className: classes,
    "data-inline": inline,
    "data-appearance": appearance
  }), children));
});
RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;