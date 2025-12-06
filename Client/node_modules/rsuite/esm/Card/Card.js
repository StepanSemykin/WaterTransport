'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import CardHeader from "./CardHeader.js";
import CardBody from "./CardBody.js";
import CardFooter from "./CardFooter.js";
import Box from "../internals/Box/index.js";
import { forwardRef, mergeStyles, getCssValue } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const Subcomponents = {
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter
};
const Card = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Card', props);
  const {
    as,
    bordered = true,
    classPrefix = 'card',
    className,
    children,
    direction,
    shaded,
    style,
    size,
    width,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix,
    cssVar
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const styles = mergeStyles(style, cssVar('width', width, getCssValue));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles,
    "data-size": size,
    "data-direction": direction,
    "data-bordered": bordered,
    "data-shaded": shaded
  }, rest), children);
}, Subcomponents);
Card.displayName = 'Card';
export default Card;