'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Check from '@rsuite/icons/Check';
import Close from '@rsuite/icons/Close';
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
const STEP_STATUS_ICON = {
  finish: /*#__PURE__*/React.createElement(Check, null),
  wait: null,
  process: null,
  error: /*#__PURE__*/React.createElement(Close, null)
};
/**
 * The `Step.Item` component is used to set the layout of the child element in the `Steps` component.
 *
 * @see https://rsuitejs.com/components/steps
 */
const StepItem = forwardRef((props, ref) => {
  var _STEP_STATUS_ICON$sta;
  const {
    as: Component = 'div',
    className,
    classPrefix = 'steps-item',
    style,
    itemWidth,
    status,
    icon,
    stepNumber,
    description,
    title,
    ...rest
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const iconNode = icon ? /*#__PURE__*/React.createElement("span", {
    className: prefix('icon')
  }, icon) : /*#__PURE__*/React.createElement("span", {
    className: prefix('icon', {
      [`icon-${status}`]: status
    })
  }, status ? (_STEP_STATUS_ICON$sta = STEP_STATUS_ICON[status]) !== null && _STEP_STATUS_ICON$sta !== void 0 ? _STEP_STATUS_ICON$sta : stepNumber : stepNumber);
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref,
    className: classes,
    style: mergeStyles({
      width: itemWidth
    }, style),
    "data-status": status,
    "data-custom-icon": !!icon
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: prefix('tail')
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix('icon-wrapper')
  }, iconNode), /*#__PURE__*/React.createElement("div", {
    className: prefix('content')
  }, /*#__PURE__*/React.createElement("div", {
    className: prefix('title')
  }, title), description && /*#__PURE__*/React.createElement("div", {
    className: prefix('description')
  }, description)));
});
StepItem.displayName = 'StepItem';
export default StepItem;