'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ArrowUpLineIcon from '@rsuite/icons/ArrowUpLine';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import InputGroup from "../InputGroup/InputGroup.js";
import InputGroupAddon from "../InputGroup/InputGroupAddon.js";
import Input from "../Input/index.js";
import Button from "../Button/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, partitionHTMLProps, createChainedFunction } from "../internals/utils/index.js";
import { useNumberInputValue } from "./hooks/useNumberInputValue.js";
import { useEvents } from "./hooks/useEvents.js";
import { valueReachesMax, valueReachesMin } from "./utils/number.js";
/**
 * The `NumberInput` component is used to enter a numerical value.
 * @see https://rsuitejs.com/components/number-input
 */
const NumberInput = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('NumberInput', props);
  const {
    as,
    className,
    classPrefix = 'number-input',
    controls = true,
    disabled,
    decimalSeparator,
    formatter,
    readOnly,
    plaintext,
    value: valueProp,
    defaultValue,
    size,
    prefix: prefixElement,
    postfix,
    suffix = postfix,
    step = 1,
    buttonAppearance = 'subtle',
    min: minProp,
    max: maxProp,
    scrollable = true,
    onChange,
    onWheel,
    onBlur: onBlurProp,
    onFocus: onFocusProp,
    ...rest
  } = propsWithDefaults;
  const min = minProp !== null && minProp !== void 0 ? minProp : -Infinity;
  const max = maxProp !== null && maxProp !== void 0 ? maxProp : Infinity;
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [htmlInputProps, restProps] = partitionHTMLProps(rest);
  const onChangeValue = (currentValue, event) => {
    if (currentValue !== value) {
      setValue(currentValue);
      onChange === null || onChange === void 0 || onChange(currentValue, event);
    }
  };
  const {
    inputRef,
    isFocused,
    onStepUp,
    onStepDown,
    onKeyDown,
    onFocus,
    onBlur
  } = useEvents({
    min: minProp,
    max: maxProp,
    step,
    value,
    scrollable,
    disabled,
    readOnly,
    decimalSeparator,
    onWheel,
    onChangeValue
  });
  const handleChange = useEventCallback((value, event) => {
    const separator = decimalSeparator || '.';
    const escapedSeparator = separator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Support both custom decimalSeparator and standard decimal point '.'
    let regex;
    if (separator !== '.') {
      // Allow both the custom separator and the standard decimal point
      regex = new RegExp(`^-?(?:\\d+)?([.${escapedSeparator}])?\\d*$`);
    } else {
      regex = new RegExp(`^-?(?:\\d+)?(${escapedSeparator})?\\d*$`);
    }
    if (!regex.test(value) && value !== '') {
      return;
    }
    onChangeValue(value, event);
  });
  const inputValue = useNumberInputValue({
    value,
    isFocused,
    formatter,
    decimalSeparator
  });
  const input = /*#__PURE__*/React.createElement(Input, _extends({}, htmlInputProps, {
    ref: plaintext ? ref : undefined,
    inputRef: inputRef,
    autoComplete: "off",
    inputMode: "numeric",
    step: step,
    value: inputValue,
    disabled: disabled,
    readOnly: readOnly,
    plaintext: plaintext,
    onKeyDown: onKeyDown,
    onChange: handleChange,
    onBlur: createChainedFunction(onBlur, onBlurProp),
    onFocus: createChainedFunction(onFocus, onFocusProp)
  }));
  if (plaintext) {
    return input;
  }
  const stepUpDisabled = disabled || readOnly || valueReachesMax(value, max);
  const stepDownDisabled = disabled || readOnly || valueReachesMin(value, min);
  return /*#__PURE__*/React.createElement(InputGroup, _extends({
    as: as,
    ref: ref,
    className: classes,
    disabled: disabled,
    size: size,
    inside: true
  }, restProps), prefixElement && /*#__PURE__*/React.createElement(InputGroupAddon, null, prefixElement), input, suffix && /*#__PURE__*/React.createElement(InputGroupAddon, null, suffix), controls && /*#__PURE__*/React.createElement("span", {
    className: prefix('btn-group-vertical')
  }, /*#__PURE__*/React.createElement(Button, {
    tabIndex: -1,
    appearance: buttonAppearance,
    className: prefix('touchspin-up'),
    onClick: onStepUp,
    disabled: stepUpDisabled,
    "aria-label": "Increment",
    size: size
  }, typeof controls === 'function' ? controls('up') : /*#__PURE__*/React.createElement(ArrowUpLineIcon, null)), /*#__PURE__*/React.createElement(Button, {
    tabIndex: -1,
    appearance: buttonAppearance,
    className: prefix('touchspin-down'),
    onClick: onStepDown,
    disabled: stepDownDisabled,
    "aria-label": "Decrement",
    size: size
  }, typeof controls === 'function' ? controls('down') : /*#__PURE__*/React.createElement(ArrowDownLineIcon, null))));
});
NumberInput.displayName = 'NumberInput';
export default NumberInput;