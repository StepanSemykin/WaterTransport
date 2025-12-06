'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import remove from 'lodash/remove';
import Plaintext from "../internals/Plaintext/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef, shallowEqual } from "../internals/utils/index.js";
import { useStyles, useControlled, useCustom } from "../internals/hooks/index.js";
import { CheckboxGroupContext } from "./CheckboxGroupContext.js";
/**
 * The `CheckboxGroup` component is used for selecting multiple options which are unrelated.
 * @see https://rsuitejs.com/components/checkbox/#checkbox-group
 */
const CheckboxGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('CheckboxGroup', props);
  const {
    as,
    className,
    inline,
    children,
    name,
    value: valueProp,
    defaultValue,
    classPrefix = 'checkbox-group',
    disabled,
    readOnly,
    plaintext,
    onChange,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [value, setValue, isControlled] = useControlled(valueProp, defaultValue);
  const handleChange = useCallback((itemValue, itemChecked, event) => {
    const nextValue = cloneDeep(value) || [];
    if (itemChecked) {
      nextValue.push(itemValue);
    } else {
      remove(nextValue, i => shallowEqual(i, itemValue));
    }
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
  }, [onChange, setValue, value]);
  const contextValue = useMemo(() => ({
    inline,
    name,
    value,
    readOnly,
    disabled,
    plaintext,
    controlled: isControlled,
    onChange: handleChange
  }), [disabled, handleChange, inline, isControlled, name, plaintext, readOnly, value]);
  return /*#__PURE__*/React.createElement(CheckboxGroupContext.Provider, {
    value: contextValue
  }, plaintext ? /*#__PURE__*/React.createElement(Plaintext, _extends({
    ref: ref,
    localeKey: "notSelected"
  }, rest), value !== null && value !== void 0 && value.length ? children : null) : /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    role: "group",
    className: classes,
    "data-inline": inline
  }), children));
});
CheckboxGroup.displayName = 'CheckboxGroup';
export default CheckboxGroup;