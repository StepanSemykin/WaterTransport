'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { useStyles } from "../hooks/index.js";
import { forwardRef, createChainedFunction, mergeRefs } from "../utils/index.js";
import { useScrollState } from "./hooks/useScrollState.js";
const ScrollView = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    classPrefix = 'scroll-view',
    className,
    children,
    scrollShadow,
    customScrollbar,
    height,
    width,
    style,
    onScroll,
    ['data-testid']: dataTestId,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const {
    scrollState,
    handleScroll,
    bodyRef
  } = useScrollState(scrollShadow);
  const bodyStyles = {
    height,
    width,
    ...style
  };
  const bodyClasses = merge(className, withPrefix({
    shadow: scrollShadow,
    'thumb-top': scrollState === 'top',
    'thumb-middle': scrollState === 'middle',
    'thumb-bottom': scrollState === 'bottom',
    'custom-scrollbar': customScrollbar
  }));
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: mergeRefs(ref, bodyRef),
    className: bodyClasses,
    style: bodyStyles,
    onScroll: createChainedFunction(handleScroll, onScroll),
    "data-testid": dataTestId || 'scroll-view'
  }), children);
});
ScrollView.displayName = 'ScrollView';
export default ScrollView;