'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { mergeStyles } from "../internals/utils/index.js";
const rangeStyles = {
  position: 'absolute',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  clip: 'rect(0, 0, 0, 0)'
};
const Input = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    style,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("input", _extends({
    type: "range",
    readOnly: true,
    ref: ref,
    style: mergeStyles(rangeStyles, style)
  }, rest));
});
Input.displayName = 'Input';
export default Input;