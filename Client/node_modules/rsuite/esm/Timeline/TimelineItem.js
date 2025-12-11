'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
/**
 * The `Timeline.Item` component is used to set the layout of the child element in the `Timeline` component.
 *
 * @see https://rsuitejs.com/compo◊nents/timeline
 */
const TimelineItem = forwardRef((props, ref) => {
  const {
    as = 'li',
    children,
    classPrefix = 'timeline-item',
    last: DEPRECATED_last,
    className,
    dot,
    time,
    INTERNAL_active,
    ...rest
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    last: DEPRECATED_last,
    active: INTERNAL_active
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: prefix('tail')
  }), /*#__PURE__*/React.createElement("span", {
    className: prefix('dot', {
      'custom-dot': dot
    })
  }, dot), time && /*#__PURE__*/React.createElement("div", {
    className: prefix('time')
  }, time), /*#__PURE__*/React.createElement("div", {
    className: prefix('content')
  }, children));
});
TimelineItem.displayName = 'TimelineItem';
export default TimelineItem;