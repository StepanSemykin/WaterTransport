'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
import Button from "../Button/index.js";
/**
 * The `InputGroup.Button` component is used to specify an input field with an add-on.
 * @see https://rsuitejs.com/components/input/#input-group
 */
const InputGroupButton = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    classPrefix = 'input-group-btn',
    className,
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Button, _extends({}, rest, {
    ref: ref,
    className: classes
  }));
});
InputGroupButton.displayName = 'InputGroupButton';
export default InputGroupButton;