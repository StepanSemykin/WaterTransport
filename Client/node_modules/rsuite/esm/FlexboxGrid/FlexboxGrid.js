'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import FlexboxGridItem from "./FlexboxGridItem.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const Subcomponents = {
  Item: FlexboxGridItem
};

/**
 * The FlexboxGrid component is a box that can be used to layout other components.
 * @see https://rsuitejs.com/components/flexbox-grid
 * @deprecated Please use `Row` instead.
 * ```
 * <Row>
 *   <Col>1</Col>
 *   <Col>2</Col>
 *   <Col>3</Col>
 * </Row>
 * ```
 */
const FlexboxGrid = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('FlexboxGrid', props);
  const {
    as: Component = 'div',
    className,
    classPrefix = 'flex-box-grid',
    align = 'top',
    justify = 'start',
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(align, justify));
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: ref,
    className: classes
  }));
}, Subcomponents);
FlexboxGrid.displayName = 'FlexboxGrid';
export default FlexboxGrid;