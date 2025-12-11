'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * The `Stack.Item` component is used to set the layout of the child element in the `Stack` component.
 *
 * @see https://rsuitejs.com/components/stack
 */
const StackItem = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'stack-item',
    className,
    alignSelf,
    self = alignSelf,
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    self: self,
    paddingTop: 0
  }, rest));
});
StackItem.displayName = 'StackItem';
export default StackItem;