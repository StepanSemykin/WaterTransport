'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Stack from "./Stack.js";
import { forwardRef } from "../internals/utils/index.js";
const Subcomponents = {
  Item: Stack.Item
};
const HStack = forwardRef((props, ref) => {
  const {
    reverse,
    ...rest
  } = props;
  const direction = reverse ? 'row-reverse' : 'row';
  return /*#__PURE__*/React.createElement(Stack, _extends({}, rest, {
    direction: direction,
    ref: ref
  }));
}, Subcomponents);
HStack.displayName = 'HStack';
export default HStack;