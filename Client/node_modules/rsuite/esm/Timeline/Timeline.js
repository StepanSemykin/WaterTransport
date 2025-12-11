'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import some from 'lodash/some';
import TimelineItem from "./TimelineItem.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, rch } from "../internals/utils/index.js";
const ACTIVE_FIRST = index => index === 0;
const ACTIVE_LAST = (index, totalItemsCount) => index === totalItemsCount - 1;
const SubcomponentsAndStaticMethods = {
  Item: TimelineItem,
  ACTIVE_FIRST,
  ACTIVE_LAST
};

/**
 * The `Timeline` component is used to display a list of items in chronological order.
 *
 * @see https://rsuitejs.com/components/timeline
 */
const Timeline = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Timeline', props);
  const {
    as = 'ul',
    children,
    classPrefix = 'timeline',
    className,
    align = 'left',
    endless,
    isItemActive = ACTIVE_LAST,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const count = rch.count(children);
  const withTime = some(React.Children.toArray(children), item => {
    var _item$props;
    return item === null || item === void 0 || (_item$props = item.props) === null || _item$props === void 0 ? void 0 : _item$props.time;
  });
  const classes = merge(className, withPrefix(`align-${align}`, {
    endless,
    'with-time': withTime
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), rch.mapCloneElement(children, (_child, index) => ({
    last: index + 1 === count,
    INTERNAL_active: isItemActive(index, count),
    align
  })));
}, SubcomponentsAndStaticMethods);
Timeline.displayName = 'Timeline';
export default Timeline;