'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles, getSizeStyle } from "../internals/utils/index.js";
/**
 *
 * The `Text` component is used to display text.
 *
 * @see https://rsuitejs.com/components/text
 */
const Text = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Text', props);
  const {
    as = 'p',
    align,
    classPrefix = 'text',
    color,
    className,
    maxLines,
    weight,
    muted,
    transform,
    size,
    style,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    cssVar,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(align, weight, transform, {
    muted,
    ellipsis: maxLines
  }));
  const styles = mergeStyles(style, getSizeStyle(size, 'font'), cssVar('max-lines', maxLines));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    c: color,
    ref: ref,
    className: classes,
    style: styles
  }, rest));
});
Text.displayName = 'Text';
export default Text;