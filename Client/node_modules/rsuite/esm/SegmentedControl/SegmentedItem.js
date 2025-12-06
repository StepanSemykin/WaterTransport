'use client';
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
const SegmentedItem = ({
  item,
  index,
  name,
  active,
  disabled,
  classPrefix,
  onChange
}) => {
  const {
    prefix
  } = useStyles(classPrefix);
  const handleChange = event => {
    if (disabled) return;
    onChange(item.value, event);
  };
  return /*#__PURE__*/React.createElement("label", {
    className: prefix('item'),
    "data-value": item.value,
    "data-index": index,
    "data-active": active || undefined,
    "data-disabled": disabled || undefined
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: name,
    value: String(item.value),
    checked: active,
    disabled: disabled,
    onChange: handleChange,
    className: prefix('radio')
  }), /*#__PURE__*/React.createElement("span", {
    className: prefix('label')
  }, item.label));
};
SegmentedItem.displayName = 'SegmentedItem';
export default SegmentedItem;