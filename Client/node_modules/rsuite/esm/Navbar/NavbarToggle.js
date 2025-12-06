'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import { Burger } from "../internals/Burger/index.js";
import { useEventCallback } from "../internals/hooks/index.js";
import { createChainedFunction } from "../internals/utils/index.js";
import { NavbarContext } from "./NavbarContext.js";
const NavbarToggle = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    navbarId,
    open: contextOpen,
    onToggle: onToggleContext
  } = useContext(NavbarContext) || {};
  const {
    open,
    onClick,
    onToggle,
    ...rest
  } = props;
  const handleClick = useEventCallback(() => {
    onToggle === null || onToggle === void 0 || onToggle(true);
    onToggleContext === null || onToggleContext === void 0 || onToggleContext(true);
  });
  return /*#__PURE__*/React.createElement(Burger, _extends({
    ref: ref,
    onClick: createChainedFunction(handleClick, onClick),
    "aria-controls": `${navbarId}-drawer`,
    open: typeof open === 'boolean' ? open : contextOpen
  }, rest));
});
NavbarToggle.displayName = 'NavbarToggle';
export default NavbarToggle;