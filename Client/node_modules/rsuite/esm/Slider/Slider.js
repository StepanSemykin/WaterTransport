'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo, useRef } from 'react';
import getWidth from 'dom-lib/getWidth';
import getHeight from 'dom-lib/getHeight';
import getOffset from 'dom-lib/getOffset';
import ProgressBar from "./ProgressBar.js";
import Handle from "./Handle.js";
import Graduated from "./Graduated.js";
import Plaintext from "../internals/Plaintext/index.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { precisionMath, checkValue, getPosition } from "./utils.js";
/**
 * A Slider is an interface for users to adjust a value in a specific range.
 *
 * @see https://rsuitejs.com/components/slider
 */
const Slider = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Slider', props);
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-valuetext': ariaValuetext,
    as,
    className,
    classPrefix = 'slider',
    barClassName,
    defaultValue = 0,
    disabled,
    progress,
    graduated,
    handleClassName,
    handleStyle,
    handleTitle,
    keepTooltipOpen,
    readOnly,
    step = 1,
    size = 'sm',
    tooltip = true,
    max: maxProp = 100,
    placeholder,
    plaintext,
    marks,
    min = 0,
    vertical,
    value: valueProp,
    getAriaValueText,
    renderTooltip,
    renderMark,
    onChange,
    onChangeCommitted,
    ...rest
  } = propsWithDefaults;
  const barRef = useRef(null);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const {
    rtl
  } = useCustom('Slider');
  const classes = merge(className, withPrefix());
  const max = useMemo(() => precisionMath(Math.floor((maxProp - min) / step) * step + min), [maxProp, min, step]);

  /**
   * Returns a valid value that does not exceed the specified range of values.
   */
  const getValidValue = useCallback(value => {
    return checkValue(value, min, max);
  }, [max, min]);
  const [value, setValue] = useControlled(getValidValue(valueProp), getValidValue(defaultValue));
  const count = useMemo(() => precisionMath((max - min) / step), [max, min, step]);

  // Get the height of the progress bar
  const getBarHeight = useCallback(() => barRef.current ? getHeight(barRef.current) : 0, []);
  // Get the width of the progress bar
  const getBarWidth = useCallback(() => barRef.current ? getWidth(barRef.current) : 0, []);
  const getValueByOffset = useCallback(offset => {
    let value = 0;
    if (isNaN(offset)) {
      return value;
    }
    if (vertical) {
      const barHeight = getBarHeight();
      value = Math.round(offset / (barHeight / count)) * step;
    } else {
      const barWidth = getBarWidth();
      value = Math.round(offset / (barWidth / count)) * step;
    }
    return precisionMath(value);
  }, [count, getBarHeight, getBarWidth, step, vertical]);

  /**
   * A value within the valid range is calculated from the position triggered by the event.
   */
  const getValueByPosition = useCallback(event => {
    const barOffset = getOffset(barRef.current);
    const {
      pageX,
      pageY
    } = getPosition(event);
    let offset;
    if (vertical) {
      // For vertical sliders, top is 0% and bottom is 100% in both LTR and RTL
      offset = barOffset.top + barOffset.height - pageY;
    } else {
      // For horizontal sliders, handle RTL direction
      offset = pageX - barOffset.left;
      if (rtl) {
        // In RTL, invert the offset so that dragging right decreases the value
        offset = barOffset.width - offset;
      }
    }
    return getValueByOffset(offset) + min;
  }, [getValueByOffset, min, rtl, vertical]);

  /**
   * Callback function that is fired when the mousemove is triggered
   */
  const handleChangeValue = useEventCallback(event => {
    if (disabled || readOnly) {
      return;
    }
    const nextValue = getValidValue(getValueByPosition(event));
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
  });

  /**
   * Callback function that is fired when the mouseup is triggered
   */
  const handleChangeCommitted = useEventCallback(event => {
    if (disabled || readOnly) {
      return;
    }
    const nextValue = getValidValue(getValueByPosition(event));
    onChangeCommitted === null || onChangeCommitted === void 0 || onChangeCommitted(nextValue, event);
  });
  const handleClickBar = useEventCallback(event => {
    handleChangeValue(event);
    handleChangeCommitted(event);
  });
  const handleKeyDown = useEventCallback(event => {
    let nextValue;
    const increaseKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    switch (event.key) {
      case 'Home':
        nextValue = min;
        break;
      case 'End':
        nextValue = max;
        break;
      case increaseKey:
      case 'ArrowUp':
        nextValue = Math.min(max, value + step);
        break;
      case decreaseKey:
      case 'ArrowDown':
        nextValue = Math.max(min, value - step);
        break;
      default:
        return;
    }

    // Prevent scroll of the page
    event.preventDefault();
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
  });
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, {
      localeKey: "notSelected",
      ref: ref,
      placeholder: placeholder
    }, value);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    role: "presentation",
    className: classes,
    "data-size": size,
    "data-disabled": disabled,
    "data-readonly": readOnly,
    "data-graduated": graduated,
    "data-with-mark": renderMark ? 'true' : undefined,
    "data-direction": vertical ? 'vertical' : 'horizontal'
  }, rest), /*#__PURE__*/React.createElement("div", {
    ref: barRef,
    className: merge(barClassName, prefix('bar')),
    onClick: handleClickBar,
    "data-testid": "slider-bar"
  }, progress && /*#__PURE__*/React.createElement(ProgressBar, {
    vertical: vertical,
    start: 0,
    end: (value - min) / (max - min) * 100
  }), graduated && /*#__PURE__*/React.createElement(Graduated, {
    step: step,
    min: min,
    max: max,
    count: count,
    value: value,
    marks: marks,
    renderMark: renderMark
  })), /*#__PURE__*/React.createElement(Handle, {
    position: (value - min) / (max - min) * 100,
    className: handleClassName,
    style: handleStyle,
    disabled: disabled,
    vertical: vertical,
    tooltip: tooltip,
    value: value,
    keepTooltipOpen: keepTooltipOpen,
    renderTooltip: renderTooltip,
    onDragMove: handleChangeValue,
    onKeyDown: handleKeyDown,
    onDragEnd: handleChangeCommitted,
    tabIndex: disabled || readOnly ? undefined : 0,
    "aria-orientation": vertical ? 'vertical' : 'horizontal',
    "aria-valuenow": value,
    "aria-disabled": disabled,
    "aria-valuetext": getAriaValueText ? getAriaValueText(value) : ariaValuetext,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    "aria-valuemax": max,
    "aria-valuemin": min
  }, handleTitle));
});
Slider.displayName = 'Slider';
export default Slider;