'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Input from "../Input/index.js";
import usePinInputRefs from "./hooks/usePinInputRefs.js";
import usePinValue from "./hooks/usePinValue.js";
import { Box } from "../internals/Box/index.js";
import { HStack } from "../Stack/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
/**
 * Map `type` prop to regex for allowed keys
 */
function getAllowedKeys(type) {
  if (type instanceof RegExp) {
    return type;
  }
  switch (type) {
    case 'alphabetic':
      return /[A-Za-z]/;
    case 'alphanumeric':
      return /[A-Za-z0-9]/;
    default:
      // number and any other fallback
      return /\d/;
  }
}
const PinInput = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PinInput', props);
  const {
    type = 'number',
    as,
    autoFocus,
    attached,
    className,
    classPrefix = 'pin-input',
    defaultValue = '',
    disabled,
    length = 4,
    mask,
    name,
    otp,
    placeholder,
    readOnly,
    size = 'md',
    value: controlValue,
    onChange,
    onComplete,
    ...rest
  } = propsWithDefaults;

  // Regex for filtering input chars based on type prop
  const allowedKeys = getAllowedKeys(type);

  // Determine inputMode based on type prop
  const inputModeValue = type === 'number' ? 'numeric' : 'text';

  // Determine input type attribute based on type prop and mask
  const inputTypeValue = mask ? 'password' : type === 'number' ? 'tel' : 'text';
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);

  // Use our custom hook for handling input refs and focus behavior
  const {
    focusInput,
    focusNextInput,
    focusPrevInput,
    getRefSetter
  } = usePinInputRefs(length, autoFocus);

  // Use our custom hook for managing PIN values
  const {
    valueArray,
    setDigit,
    clearDigit,
    updateValue
  } = usePinValue(controlValue, defaultValue, length, onChange, onComplete);

  // Handle input change
  const handleInputChange = useEventCallback((inputValue, e, index) => {
    // Safety check for event object
    if (!e || !e.target) return;

    // For single character input, use it directly
    // For longer input (like paste or browser autofill), take the last character
    const char = inputValue.length > 0 ? inputValue.charAt(inputValue.length - 1) : '';

    // Filter by allowedKeys if provided
    if (!allowedKeys.test(char)) {
      return;
    }

    // Always allow overwriting the current value
    // Update the value using our hook
    setDigit(index, char);

    // Focus the next input if we have a character and there's a next input
    if (char && index < length - 1) {
      // Use setTimeout to ensure the focus happens after the current event cycle
      focusNextInput(index);
    }

    // If this is the last input and a character was entered, keep focus on it
    if (char && index === length - 1) {
      focusInput(index);
    }
  });

  // Handle key down
  const handleKeyDown = useEventCallback((e, index) => {
    // Safety check for event object
    if (!e) return;
    const target = e.target;
    const inputValue = (target === null || target === void 0 ? void 0 : target.value) || '';

    // Handle backspace
    if (e.key === 'Backspace') {
      if (inputValue === '') {
        // Focus the previous input if the current one is empty
        if (index > 0) {
          clearDigit(index - 1);
          focusPrevInput(index);
        }
      } else {
        // Clear the current input but keep focus on it
        clearDigit(index);
      }
    }
    // Handle arrow keys
    else if (e.key === 'ArrowLeft') {
      focusPrevInput(index);
    } else if (e.key === 'ArrowRight') {
      focusNextInput(index);
    }
    // Allow only keys matching allowedKeys
    else if (allowedKeys.test(e.key)) {
      setDigit(index, e.key);

      // Move focus to the next input if there is one
      if (index < length - 1) {
        setTimeout(() => {
          focusNextInput(index);
        }, 10);
      }
    }
  });

  // Handle paste
  const handlePaste = useEventCallback((e, index) => {
    if (disabled || readOnly) return;

    // Safety check for event object
    if (!e || !e.clipboardData) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text') || '';

    // Filter pasted data by allowedKeys
    const filteredData = pastedData.split('').filter(ch => allowedKeys.test(ch)).join('');
    if (filteredData) {
      // Create a new value with pasted characters
      const newValueArray = [...valueArray];
      for (let i = 0; i < filteredData.length && index + i < length; i++) {
        newValueArray[index + i] = filteredData[i];
      }

      // Update value with our hook
      updateValue(newValueArray.join(''));

      // Focus the input after the last pasted character or the last input
      // Use setTimeout to ensure focus happens after DOM updates
      const nextIndex = Math.min(index + filteredData.length, length - 1);
      setTimeout(() => {
        focusInput(nextIndex);
      }, 10);
    }
  });
  const classes = merge(className, withPrefix({
    attached
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    value: valueArray.join(''),
    name: name,
    "aria-label": "Pin input"
  }), /*#__PURE__*/React.createElement(HStack, {
    spacing: attached ? 0 : 8
  }, Array.from({
    length
  }).map((_, index) => /*#__PURE__*/React.createElement(Input, {
    key: index,
    className: prefix('segment', {
      masked: mask
    }),
    size: size,
    value: valueArray[index] || '',
    onChange: (v, e) => handleInputChange(v, e, index),
    onKeyDown: e => handleKeyDown(e, index),
    onPaste: e => handlePaste(e, index),
    disabled: disabled,
    readOnly: readOnly,
    maxLength: 1,
    autoComplete: otp ? 'one-time-code' : 'off',
    inputMode: inputModeValue,
    placeholder: placeholder,
    type: inputTypeValue,
    ref: getRefSetter(index)
  }))));
});
PinInput.displayName = 'PinInput';
export default PinInput;