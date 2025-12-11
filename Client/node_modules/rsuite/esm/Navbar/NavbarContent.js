'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext } from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { NavbarContext } from "./NavbarContext.js";
const NavbarContent = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    className,
    classPrefix = 'navbar-content',
    children,
    ...rest
  } = props;
  const {
    onToggle
  } = useContext(NavbarContext) || {};
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const onClose = useCallback(() => {
    onToggle === null || onToggle === void 0 || onToggle(false);
  }, [onToggle]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    ref: ref,
    className: classes
  }, rest), typeof children === 'function' ? children({
    onClose
  }) : children);
});
NavbarContent.displayName = 'NavbarContent';
export default NavbarContent;