'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef } from 'react';
import Box from "../internals/Box/index.js";
import SegmentedItem from "./SegmentedItem.js";
import Indicator from "./Indicator.js";
import { forwardRef, mergeRefs } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback, useUniqueId } from "../internals/hooks/index.js";
import useIndicatorPosition from "./hooks/useIndicatorPosition.js";
/**
 * The `SegmentedControl` component is used to offer multiple exclusive options.
 * @see https://rsuitejs.com/components/segmented-control
 */
const SegmentedControl = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('SegmentedControl', props);
  const {
    as,
    className,
    classPrefix = 'segmented-control',
    value: valueProp,
    defaultValue,
    indicator = 'pill',
    size = 'md',
    block = false,
    name,
    disabled,
    data,
    onChange,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const id = useUniqueId('segmented', name);

  // Ref for container element
  const containerRef = useRef(null);

  // Get the active item index
  const activeIndex = data === null || data === void 0 ? void 0 : data.findIndex(item => item.value === value);
  const {
    style: indicatorStyle
  } = useIndicatorPosition({
    containerRef,
    activeIndex,
    indicator,
    data
  });
  const handleChange = useEventCallback((nextValue, event) => {
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue !== null && nextValue !== void 0 ? nextValue : '', event);
  });
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "radiogroup",
    ref: mergeRefs(ref, containerRef),
    className: classes,
    "data-size": size,
    "data-block": block || undefined,
    "data-indicator": indicator
  }, rest), data === null || data === void 0 ? void 0 : data.map((item, index) => /*#__PURE__*/React.createElement(SegmentedItem, {
    key: index,
    item: item,
    index: index,
    name: id,
    active: value === item.value,
    disabled: disabled,
    classPrefix: classPrefix,
    onChange: handleChange
  })), activeIndex !== -1 && /*#__PURE__*/React.createElement(Indicator, {
    style: indicatorStyle,
    classPrefix: classPrefix
  }));
});
SegmentedControl.displayName = 'SegmentedControl';
export default SegmentedControl;