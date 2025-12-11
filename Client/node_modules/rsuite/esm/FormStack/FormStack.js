'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The `<Form.Stack>` component is a quick layout component through Flexbox,
 * supporting vertical and horizontal stacking, custom spacing and line wrapping.
 * @see https://rsuitejs.com/components/form/
 */
const FormStack = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('FormStack', props);
  const {
    as,
    classPrefix = 'form-stack',
    className,
    children,
    layout = 'vertical',
    fluid,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(layout, {
    fluid
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), children);
});
FormStack.displayName = 'FormStack';
export default FormStack;