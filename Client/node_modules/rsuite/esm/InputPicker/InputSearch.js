'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useEventCallback } from "../internals/hooks/index.js";
const InputSearch = forwardRef((props, ref) => {
  const {
    as: Component = 'input',
    classPrefix = 'picker-search',
    children,
    className,
    value,
    inputRef,
    style,
    readOnly,
    onChange,
    ...rest
  } = props;
  const handleChange = useEventCallback(event => {
    var _event$target;
    onChange === null || onChange === void 0 || onChange(event === null || event === void 0 || (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.value, event);
  });
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    className: classes,
    style: style
  }, /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: inputRef,
    readOnly: readOnly,
    className: prefix`input`,
    value: value,
    onChange: handleChange
  })), children);
});
InputSearch.displayName = 'InputSearch';
export default InputSearch;