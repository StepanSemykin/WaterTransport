'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
const ProgressBar = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'slider-progress-bar',
    vertical,
    end = 0,
    start = 0,
    style,
    className,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const sizeKey = vertical ? 'height' : 'width';
  const startKey = vertical ? 'bottom' : 'insetInlineStart';
  const styles = mergeStyles(style, {
    [startKey]: `${start}%`,
    [sizeKey]: `${end - start}%`
  });
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    style: styles,
    className: classes,
    "data-testid": "slider-progress-bar"
  }, rest));
});
ProgressBar.displayName = 'ProgressBar';
export default ProgressBar;