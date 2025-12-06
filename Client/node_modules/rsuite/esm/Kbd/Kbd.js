'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 *
 * The `Kbd` component is used to display a Kbd.
 *
 * @see https://rsuitejs.com/components/kbd
 */
const Kbd = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Kbd', props);
  const {
    as = 'kbd',
    classPrefix = 'kbd',
    className,
    size = 'md',
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(size));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }));
});
Kbd.displayName = 'Kbd';
export default Kbd;