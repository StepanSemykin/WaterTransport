'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Button from "../Button/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useToggleCaret } from "../internals/hooks/index.js";
const DropdownToggle = forwardRef((props, ref) => {
  const {
    as: Component = Button,
    className,
    classPrefix = 'dropdown-toggle',
    renderToggle,
    children,
    icon,
    noCaret,
    placement = 'bottomStart',
    ...rest
  } = props;
  const {
    prefix,
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    'no-caret': noCaret
  }));

  // Caret icon is down by default, when Dropdown is used in Sidenav.
  const Caret = useToggleCaret(placement);
  const toggle = /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: ref,
    className: classes
  }), icon && /*#__PURE__*/React.cloneElement(icon, {
    className: prefix('icon')
  }), children, noCaret ? null : /*#__PURE__*/React.createElement(Caret, {
    className: prefix('caret')
  }));
  return renderToggle ? renderToggle(rest, ref) : toggle;
});
DropdownToggle.displayName = 'DropdownToggle';
export default DropdownToggle;