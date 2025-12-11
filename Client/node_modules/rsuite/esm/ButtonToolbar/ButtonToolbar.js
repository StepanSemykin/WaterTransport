'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Stack from "../Stack/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
/**
 * The ButtonToolbar component is used to group a series of buttons together in a single line.
 * @see https://rsuitejs.com/components/button/#button-toolbar
 */
const ButtonToolbar = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('ButtonToolbar', props);
  const {
    as,
    className,
    classPrefix = 'btn-toolbar',
    role = 'toolbar',
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Stack, _extends({
    wrap: true,
    spacing: 8,
    as: as,
    role: role,
    ref: ref,
    className: classes
  }, rest));
});
ButtonToolbar.displayName = 'ButtonToolbar';
export default ButtonToolbar;