'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles, createOffsetStyles, isPresetColor, createColorVariables } from "../internals/utils/index.js";
/**
 * The Badge component is usually used to mark or highlight the status or quantity of an object.
 * @see https://rsuitejs.com/components/badge
 */
const Badge = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Badge', props);
  const {
    as,
    content,
    color,
    className,
    classPrefix = 'badge',
    children,
    compact,
    maxCount = 99,
    offset,
    outline = true,
    placement = 'topEnd',
    shape,
    size = 'md',
    style,
    invisible,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const text = typeof content === 'number' && content > maxCount ? `${maxCount}+` : content;
  const isOneChar = useMemo(() => {
    var _String;
    return ((_String = String(content)) === null || _String === void 0 ? void 0 : _String.length) === 1;
  }, [content]);
  const classes = merge(className, withPrefix({
    wrapper: children
  }));
  const styles = useMemo(() => mergeStyles(style, createOffsetStyles(offset, '--rs-badge-offset'), createColorVariables(color, '--rs-badge-bg')), [style, offset, color]);
  const dataAttributes = useMemo(() => {
    return {
      ['data-color']: isPresetColor(color) ? color : undefined,
      ['data-shape']: shape,
      ['data-compact']: compact,
      ['data-one-char']: isOneChar,
      ['data-outline']: outline,
      ['data-hidden']: invisible,
      ['data-independent']: !children,
      ['data-placement']: children ? placement : undefined,
      ['data-size']: size
    };
  }, [color, shape, compact, isOneChar, outline, invisible, children, placement, size]);
  if (!children) {
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: ref,
      className: classes,
      style: styles
    }, dataAttributes, rest), text);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles
  }, dataAttributes, rest), children, /*#__PURE__*/React.createElement("div", {
    className: prefix('content')
  }, text));
});
Badge.displayName = 'Badge';
export default Badge;