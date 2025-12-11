'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
/**
 * The `InputGroup.Addon` component is used to specify an input field with an add-on.
 * @see https://rsuitejs.com/components/input/#input-group
 */
const InputGroupAddon = forwardRef((props, ref) => {
  const {
    as = 'span',
    classPrefix = 'input-group-addon',
    className,
    disabled,
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    disabled
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }));
});
InputGroupAddon.displayName = 'InputGroupAddon';
export default InputGroupAddon;