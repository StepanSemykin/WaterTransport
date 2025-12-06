'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import StackItem from "./StackItem.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const Subcomponents = {
  Item: StackItem
};

/**
 * The `Stack` component is a quick layout component through Flexbox,
 * supporting vertical and horizontal stacking, custom spacing and line wrapping.
 *
 * @see https://rsuitejs.com/components/stack
 */
const Stack = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Stack', props);
  const {
    as,
    classPrefix = 'stack',
    className,
    children,
    direction,
    divider,
    wrap,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    responsive
  } = useStyles(classPrefix);
  const baseClasses = merge(className, withPrefix(), ...responsive(direction));
  const filteredChildren = React.Children.toArray(children);
  const childCount = filteredChildren.length;
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: baseClasses,
    "data-wrap": wrap
  }, rest), filteredChildren.map((child, index) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: index
  }, child, index < childCount - 1 && divider)));
}, Subcomponents);
Stack.displayName = 'Stack';
export default Stack;