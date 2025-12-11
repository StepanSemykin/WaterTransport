'use client';
import { useRef, useState, useCallback } from 'react';
import { useEventCallback } from "../../internals/hooks/index.js";
import { KEY_VALUES } from "../../internals/constants/index.js";
import { clampValue, decimals } from "../utils/number.js";
import { useWheelHandler } from "./useWheelHandler.js";
export function useEvents(params) {
  const inputRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const {
    value,
    onChangeValue,
    scrollable,
    disabled,
    readOnly,
    onWheel: onWheelProp,
    min,
    max,
    step = 1,
    decimalSeparator
  } = params;
  const getSafeValue = value => clampValue(value, min, max);
  const onStepUp = useEventCallback(event => {
    const val = +(value || 0);
    const bit = decimals(val, step);
    onChangeValue(getSafeValue((val + step).toFixed(bit)), event);
  });
  const onStepDown = useEventCallback(event => {
    const val = +(value || 0);
    const bit = decimals(val, step);
    onChangeValue(getSafeValue((val - step).toFixed(bit)), event);
  });
  const onKeyDown = useEventCallback(event => {
    switch (event.key) {
      case KEY_VALUES.UP:
        event.preventDefault();
        onStepUp(event);
        break;
      case KEY_VALUES.DOWN:
        event.preventDefault();
        onStepDown(event);
        break;
      case KEY_VALUES.HOME:
        if (typeof min !== 'undefined') {
          event.preventDefault();
          onChangeValue(getSafeValue(min), event);
        }
        break;
      case KEY_VALUES.END:
        if (typeof max !== 'undefined') {
          event.preventDefault();
          onChangeValue(getSafeValue(max), event);
        }
        break;
      default:
        break;
    }
  });
  const handleWheel = useEventCallback(event => {
    if (!scrollable) {
      event.preventDefault();
      return;
    }
    if (!disabled && !readOnly && event.target === document.activeElement) {
      event.preventDefault();
      const delta = event.wheelDelta || -event.deltaY || -event.detail;
      if (delta > 0) {
        onStepDown(event);
      }
      if (delta < 0) {
        onStepUp(event);
      }
    }
    onWheelProp === null || onWheelProp === void 0 || onWheelProp(event);
  });
  const restoreDecimalSeparator = useCallback(value => {
    if (decimalSeparator && value) {
      // Handle both custom decimalSeparator and standard decimal point '.'
      if (decimalSeparator !== '.') {
        // Create a regex that matches both the custom separator and '.'
        const separatorRegex = new RegExp(`[${decimalSeparator.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}.]`, 'g');
        return value.replace(separatorRegex, '.');
      }
      return value;
    }
    return value;
  }, [decimalSeparator]);
  const onBlur = event => {
    var _event$target;
    const value = restoreDecimalSeparator((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.value);
    const targetValue = Number.parseFloat(value);
    onChangeValue(getSafeValue(targetValue), event);
    setIsFocused(false);
  };
  const onFocus = () => {
    setIsFocused(true);
  };

  // wheel events
  useWheelHandler(inputRef, handleWheel, scrollable);
  return {
    inputRef,
    isFocused,
    onStepUp,
    onStepDown,
    onKeyDown,
    onBlur,
    onFocus
  };
}