'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * The `FlexboxGrid.Item` component is used to specify the layout of the child element in the `FlexboxGrid` component.
 * @see https://rsuitejs.com/components/flexbox-grid
 * @deprecated Please use `Col` instead.
 */
const FlexboxGridItem = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    classPrefix = 'flex-box-grid-item',
    colspan = 0,
    order = 0,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    [colspan]: colspan > 0,
    [`order-${order}`]: order
  }));
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref
  }, rest, {
    className: classes
  }));
});
FlexboxGridItem.displayName = 'FlexboxGridItem';
export default FlexboxGridItem;