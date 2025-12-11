'use client';
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
const Mark = forwardRef((props, ref) => {
  const {
    as = 'span',
    mark,
    last,
    classPrefix = 'slider-mark',
    className,
    renderMark
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    last
  }));
  if (renderMark) {
    return /*#__PURE__*/React.createElement(Box, {
      as: as,
      ref: ref,
      className: classes
    }, /*#__PURE__*/React.createElement("span", {
      className: prefix('content')
    }, renderMark(mark)));
  }
  return null;
});
Mark.displayName = 'Mark';
export default Mark;