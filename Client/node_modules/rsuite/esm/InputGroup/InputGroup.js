'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useCallback, useMemo } from 'react';
import Box from "../internals/Box/index.js";
import InputGroupAddon from "./InputGroupAddon.js";
import InputGroupButton from "./InputGroupButton.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { InputGroupContext } from "./InputGroupContext.js";
const Subcomponents = {
  Addon: InputGroupAddon,
  Button: InputGroupButton
};

/**
 * The `InputGroup` component is used to specify an input field with an add-on.
 * @see https://rsuitejs.com/components/input/#input-group
 */
const InputGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('InputGroup', props);
  const {
    as,
    classPrefix = 'input-group',
    className,
    disabled,
    inside,
    size = 'md',
    children,
    ...rest
  } = propsWithDefaults;
  const [focus, setFocus] = useState(false);
  const handleFocus = useCallback(() => {
    setFocus(true);
  }, []);
  const handleBlur = useCallback(() => {
    setFocus(false);
  }, []);
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const inputGroupChildren = useMemo(() => {
    return React.Children.map(children, item => {
      if (/*#__PURE__*/React.isValidElement(item)) {
        // Fix: Add type assertion to pass the disabled prop to the child element
        return disabled ? /*#__PURE__*/React.cloneElement(item, {
          disabled
        }) : item;
      }
      return item;
    });
  }, [children, disabled]);
  const contextValue = useMemo(() => ({
    size,
    onFocus: handleFocus,
    onBlur: handleBlur
  }), [size, handleFocus, handleBlur]);
  return /*#__PURE__*/React.createElement(InputGroupContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes,
    "data-size": size,
    "data-inside": inside,
    "data-disabled": disabled,
    "data-focus": focus
  }), inputGroupChildren));
}, Subcomponents);
InputGroup.displayName = 'InputGroup';
export default InputGroup;