'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, getCssValue, mergeStyles } from "../internals/utils/index.js";
/**
 * The `Placeholder.Graph` component is used to display the loading state of the block.
 * @see https://rsuitejs.com/components/placeholder
 */
const PlaceholderGraph = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PlaceholderGraph', props);
  const {
    as,
    className,
    classPrefix = 'placeholder',
    width,
    height,
    style,
    active,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    cssVar,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix('graph'));
  const styles = mergeStyles(style, cssVar('graph-width', width, getCssValue), cssVar('graph-height', height, getCssValue));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles,
    "data-active": active
  }, rest));
});
PlaceholderGraph.displayName = 'PlaceholderGraph';
export default PlaceholderGraph;