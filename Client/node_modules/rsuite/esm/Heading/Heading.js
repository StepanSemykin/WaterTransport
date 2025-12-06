'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 *
 * The `Heading` component is used to display a heading.
 *
 * @see https://rsuitejs.com/components/heading
 */
const Heading = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Heading', props);
  const {
    as,
    classPrefix = 'heading',
    className,
    level = 3,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as || `h${level}`
  }, rest, {
    ref: ref,
    className: classes
  }));
});
Heading.displayName = 'Heading';
export default Heading;