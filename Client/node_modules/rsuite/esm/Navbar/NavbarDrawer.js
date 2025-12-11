'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import Drawer from "../Drawer/index.js";
import { useEventCallback } from "../internals/hooks/index.js";
import { createComponent, createChainedFunction } from "../internals/utils/index.js";
import { NavbarContext } from "./NavbarContext.js";
const NavDrawer = createComponent({
  name: 'NavbarDrawer',
  componentAs: Drawer,
  componentClassPrefix: 'navbar-drawer'
});
const NavbarDrawer = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    onToggle,
    navbarId,
    open: navbarOpen
  } = useContext(NavbarContext) || {};
  const {
    onClose,
    open = navbarOpen,
    ...rest
  } = props;
  const handleClose = useEventCallback(() => {
    onToggle === null || onToggle === void 0 || onToggle(false);
  });
  return /*#__PURE__*/React.createElement(NavDrawer, _extends({
    ref: ref,
    open: open,
    id: `${navbarId}-drawer`,
    onClose: createChainedFunction(handleClose, onClose)
  }, rest));
});
NavbarDrawer.displayName = 'NavbarDrawer';
export default NavbarDrawer;