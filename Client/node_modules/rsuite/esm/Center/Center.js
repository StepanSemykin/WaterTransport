'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
const Center = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'center',
    className,
    children,
    inline,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    "data-inline": inline,
    className: classes
  }, rest), children);
});
Center.displayName = 'Center';
export default Center;