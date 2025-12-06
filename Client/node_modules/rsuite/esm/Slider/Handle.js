'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Tooltip from "../Tooltip/index.js";
import Input from "./Input.js";
import useDrag from "./useDrag.js";
import Box from "../internals/Box/index.js";
import { forwardRef, mergeRefs, mergeStyles } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
const Handle = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'slider',
    className,
    disabled,
    style,
    children,
    position,
    vertical,
    tooltip,
    value,
    role,
    tabIndex,
    keepTooltipOpen,
    renderTooltip,
    onDragStart,
    onDragMove,
    onDragEnd,
    onKeyDown,
    'data-range': dataRange,
    'data-key': dateKey,
    ...rest
  } = props;
  const actualTooltip = tooltip || keepTooltipOpen;
  const {
    merge,
    prefix,
    cssVar
  } = useStyles(classPrefix);
  const styles = mergeStyles(style, cssVar('offset', `${position}%`));
  const {
    active,
    onMoveStart,
    onMouseEnter,
    rootRef,
    tooltipRef
  } = useDrag({
    tooltip: actualTooltip,
    disabled,
    onDragStart,
    onDragMove,
    onDragEnd,
    keepTooltipOpen
  });
  const handleClasses = merge(className, prefix('handle'), {
    active: active || keepTooltipOpen
  });
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    role: role,
    tabIndex: tabIndex,
    ref: mergeRefs(ref, rootRef),
    className: handleClasses,
    onMouseDown: onMoveStart,
    onMouseEnter: onMouseEnter,
    onTouchStart: onMoveStart,
    onKeyDown: onKeyDown,
    style: styles,
    "data-range": dataRange,
    "data-key": dateKey,
    "data-testid": "slider-handle"
  }, actualTooltip && /*#__PURE__*/React.createElement(Tooltip, {
    "aria-hidden": "true",
    ref: tooltipRef,
    className: prefix('tooltip'),
    "data-placement": vertical ? 'left' : 'top'
  }, renderTooltip ? renderTooltip(value) : value), /*#__PURE__*/React.createElement(Input, _extends({
    tabIndex: -1,
    value: value
  }, rest)), children);
});
Handle.displayName = 'Handle';
export default Handle;