'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo, useRef, useCallback } from 'react';
import getWidth from 'dom-lib/getWidth';
import getHeight from 'dom-lib/getHeight';
import getOffset from 'dom-lib/getOffset';
import ProgressBar from "../Slider/ProgressBar.js";
import Handle from "../Slider/Handle.js";
import Graduated from "../Slider/Graduated.js";
import Plaintext from "../internals/Plaintext/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
import { precisionMath, checkValue, getPosition } from "../Slider/utils.js";
const defaultDefaultValue = [0, 0];

/**
 * The `RangeSlider` component is used to select a range from a given numerical range.
 * @see https://rsuitejs.com/components/slider/
 */
const RangeSlider = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('RangeSlider', props);
  const {
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    'aria-valuetext': ariaValuetext,
    as,
    barClassName,
    className,
    classPrefix = 'slider',
    constraint,
    defaultValue = defaultDefaultValue,
    disabled,
    graduated,
    progress = true,
    keepTooltipOpen = false,
    vertical,
    readOnly,
    min = 0,
    max: maxProp = 100,
    step = 1,
    size = 'sm',
    value: valueProp,
    handleClassName,
    handleStyle,
    handleTitle,
    tooltip = true,
    marks,
    plaintext,
    placeholder,
    getAriaValueText,
    renderTooltip,
    renderMark,
    onChange,
    onChangeCommitted,
    ...rest
  } = propsWithDefaults;
  const barRef = useRef(null);

  // Define the parameter position of the handle
  const handleIndexs = useRef([0, 1]);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const {
    rtl
  } = useCustom('RangeSlider');
  const classes = merge(className, withPrefix());
  const max = useMemo(() => precisionMath(Math.floor((maxProp - min) / step) * step + min), [maxProp, min, step]);

  /**
   * Returns a valid value that does not exceed the specified range of values.
   */
  const getValidValue = useCallback(value => {
    if (typeof value === 'undefined') {
      return;
    }
    return [checkValue(value[0], min, max), checkValue(value[1], min, max)];
  }, [max, min]);
  const [value, setValue] = useControlled(getValidValue(valueProp), getValidValue(defaultValue));

  // The count of values that can be entered.
  const count = useMemo(() => precisionMath((max - min) / step), [max, min, step]);

  // Get the height of the progress bar
  const getBarHeight = useCallback(() => barRef.current ? getHeight(barRef.current) : 0, []);
  // Get the width of the progress bar
  const getBarWidth = useCallback(() => barRef.current ? getWidth(barRef.current) : 0, []);
  const getValueByOffset = useCallback(offset => {
    let val = 0;
    if (isNaN(offset)) {
      return val;
    }
    if (vertical) {
      const barHeight = getBarHeight();
      val = Math.round(offset / (barHeight / count)) * step;
    } else {
      const barWidth = getBarWidth();
      val = Math.round(offset / (barWidth / count)) * step;
    }
    return precisionMath(val);
  }, [count, getBarHeight, getBarWidth, step, vertical]);
  const getValueByPosition = useCallback(event => {
    const barOffset = getOffset(barRef.current);
    const {
      pageX,
      pageY
    } = getPosition(event);
    const offset = vertical ? barOffset.top + barOffset.height - pageY : pageX - barOffset.left;
    const val = rtl && !vertical ? barOffset.width - offset : offset;
    return getValueByOffset(val) + min;
  }, [getValueByOffset, min, rtl, vertical]);
  const getRangeValue = useCallback((value, key, event) => {
    // Get the corresponding value according to the cursor position
    const v = getValueByPosition(event);

    // Judge the handle key and put the corresponding value at the start or end.
    if (key === 'start') {
      return [v, value[1]];
    } else if (key === 'end') {
      return [value[0], v];
    }
    return value;
  }, [getValueByPosition]);
  const getNextValue = useCallback((event, dataset) => {
    const {
      key: eventKey,
      range
    } = dataset;
    const value = range.split(',').map(i => +i);
    const nextValue = getValidValue(getRangeValue(value, eventKey, event));
    if (nextValue[0] >= nextValue[1]) {
      /**
       * When the value of `start` is greater than the value of` end`,
       * the position of the handle is reversed.
       */
      handleIndexs.current.reverse();
      if (eventKey === 'start') {
        nextValue[0] = value[1];
      } else {
        nextValue[1] = value[0];
      }
    }
    return nextValue;
  }, [getRangeValue, getValidValue]);

  /**
   * Whether a range is valid against given constraint (if any)
   * Should check before every `setValue` calls
   */
  const isRangeMatchingConstraint = useCallback(range => {
    // If no constraint is defined, any range is valid
    if (!constraint) return true;
    return constraint(range);
  }, [constraint]);

  /**
   * Callback function that is fired when the mousemove is triggered
   */
  const handleDragMove = useEventCallback((event, dataset) => {
    if (disabled || readOnly) {
      return;
    }
    const nextValue = getNextValue(event, dataset);
    if (isRangeMatchingConstraint(nextValue)) {
      setValue(nextValue);
      onChange === null || onChange === void 0 || onChange(nextValue, event);
    }
  });

  /**
   * Callback function that is fired when the mouseup is triggered
   */
  const handleChangeCommitted = useEventCallback((event, dataset) => {
    if (disabled || readOnly) {
      return;
    }
    const nextValue = getNextValue(event, dataset);
    if (isRangeMatchingConstraint(nextValue)) {
      setValue(nextValue);
      onChangeCommitted === null || onChangeCommitted === void 0 || onChangeCommitted(nextValue, event);
    }
  });
  const handleKeyDown = useEventCallback(event => {
    const target = event.target;
    const {
      key
    } = (target === null || target === void 0 ? void 0 : target.dataset) || {};
    const nextValue = [...value];
    const increaseKey = rtl ? 'ArrowLeft' : 'ArrowRight';
    const decreaseKey = rtl ? 'ArrowRight' : 'ArrowLeft';
    const valueIndex = key === 'start' ? 0 : 1;
    switch (event.key) {
      case 'Home':
        nextValue[valueIndex] = min;
        break;
      case 'End':
        nextValue[valueIndex] = max;
        break;
      case increaseKey:
      case 'ArrowUp':
        nextValue[valueIndex] = Math.min(max, value[valueIndex] + step);
        break;
      case decreaseKey:
      case 'ArrowDown':
        nextValue[valueIndex] = Math.max(min, value[valueIndex] - step);
        break;
      default:
        return;
    }

    // When the start value is greater than the end value, let the handle and value switch positions.
    if (nextValue[0] >= nextValue[1]) {
      nextValue.reverse();
      handleIndexs.current.reverse();
    }

    // Prevent scroll of the page
    event.preventDefault();
    if (isRangeMatchingConstraint(nextValue)) {
      setValue(nextValue);
      onChange === null || onChange === void 0 || onChange(nextValue, event);
    }
  });
  const handleBarClick = useEventCallback(event => {
    if (disabled || readOnly) {
      return;
    }
    let [start, end] = value;
    const v = getValueByPosition(event);

    // Judging that the current click value is closer to the values of `start` and `end`.
    if (Math.abs(start - v) < Math.abs(end - v)) {
      start = v;
    } else {
      end = v;
    }
    const nextValue = getValidValue([start, end].sort((a, b) => a - b));
    if (isRangeMatchingConstraint(nextValue)) {
      setValue(nextValue);
      onChange === null || onChange === void 0 || onChange(nextValue, event);
      onChangeCommitted === null || onChangeCommitted === void 0 || onChangeCommitted(nextValue, event);
    }
  });
  const handleProps = useMemo(() => [{
    value: value[0],
    'data-key': 'start',
    'aria-valuenow': value[0],
    'aria-valuetext': getAriaValueText ? getAriaValueText(value[0], 'start') : ariaValuetext,
    position: (value[0] - min) / (max - min) * 100
  }, {
    value: value[1],
    'data-key': 'end',
    'aria-valuenow': value[1],
    'aria-valuetext': getAriaValueText ? getAriaValueText(value[1], 'end') : ariaValuetext,
    position: (value[1] - min) / (max - min) * 100
  }], [ariaValuetext, getAriaValueText, max, min, value]);
  const handleCommonProps = {
    disabled,
    vertical,
    tooltip,
    className: handleClassName,
    style: handleStyle,
    renderTooltip,
    onDragMove: handleDragMove,
    onDragEnd: handleChangeCommitted,
    onKeyDown: handleKeyDown,
    tabIndex: disabled ? undefined : 0,
    'aria-orientation': vertical ? 'vertical' : 'horizontal',
    'aria-disabled': disabled,
    'aria-valuemax': max,
    'aria-valuemin': min,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    keepTooltipOpen
  };
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, {
      localeKey: "notSelected",
      ref: ref,
      placeholder: placeholder
    }, value && (value[0] || value[1]) ? value.join('~') : null);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "data-size": size,
    "data-disabled": disabled,
    "data-readonly": readOnly,
    "data-graduated": graduated,
    "data-direction": vertical ? 'vertical' : 'horizontal',
    "data-with-mark": renderMark ? 'true' : undefined
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: merge(barClassName, prefix('bar')),
    ref: barRef,
    onClick: handleBarClick
  }, progress && /*#__PURE__*/React.createElement(ProgressBar, {
    vertical: vertical,
    start: (value[0] - min) / (max - min) * 100,
    end: (value[1] - min) / (max - min) * 100
  }), graduated && /*#__PURE__*/React.createElement(Graduated, {
    step: step,
    min: min,
    max: max,
    count: count,
    value: value,
    marks: marks,
    renderMark: renderMark
  })), /*#__PURE__*/React.createElement(Handle, _extends({
    "data-range": value
  }, handleCommonProps, handleProps[handleIndexs.current[0]]), handleTitle), /*#__PURE__*/React.createElement(Handle, _extends({
    "data-range": value
  }, handleCommonProps, handleProps[handleIndexs.current[1]]), handleTitle));
});
RangeSlider.displayName = 'RangeSlider';
export default RangeSlider;