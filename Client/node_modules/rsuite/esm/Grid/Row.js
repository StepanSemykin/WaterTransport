'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
import { getResponsiveGutterStyles } from "./utils/styles.js";
/**
 * The Row component is used to create a row container that can contain Col components.
 * @see https://rsuitejs.com/components/grid
 */
const Row = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Row', props);
  const {
    as,
    className,
    classPrefix = 'row',
    style,
    align,
    justify,
    gutter,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    responsive
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(), ...responsive(align), ...responsive(justify));
  const rowStyles = mergeStyles(style, getResponsiveGutterStyles(gutter));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes,
    style: rowStyles
  }));
});
Row.displayName = 'Row';
export default Row;