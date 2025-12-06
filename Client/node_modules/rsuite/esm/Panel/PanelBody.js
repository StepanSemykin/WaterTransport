'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Collapse from "../Animation/Collapse.js";
import ScrollView from "../internals/ScrollView/index.js";
import { useStyles } from "../internals/hooks/index.js";
const PanelBody = props => {
  const {
    classPrefix = 'panel-body',
    children,
    collapsible,
    expanded,
    bodyFill,
    role,
    id,
    labelId,
    scrollShadow,
    className,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
    onScroll,
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const bodyClasses = merge(className, withPrefix({
    fill: bodyFill
  }));
  const renderBody = bodyProps => {
    return /*#__PURE__*/React.createElement(ScrollView, _extends({}, rest, bodyProps, {
      customScrollbar: true,
      className: bodyClasses,
      onScroll: onScroll,
      scrollShadow: scrollShadow
    }), children);
  };
  return collapsible ? /*#__PURE__*/React.createElement(Collapse, {
    in: expanded,
    onEnter: onEnter,
    onEntering: onEntering,
    onEntered: onEntered,
    onExit: onExit,
    onExiting: onExiting,
    onExited: onExited
  }, (transitionProps, ref) => {
    const {
      className,
      ...rest
    } = transitionProps;
    return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
      className: merge(className, prefix('collapse')),
      ref: ref
    }), renderBody({
      role,
      id,
      'aria-labelledby': labelId
    }));
  }) : renderBody();
};
export default PanelBody;