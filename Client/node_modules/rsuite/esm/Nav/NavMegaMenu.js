'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import NavbarMegaMenu from "../Navbar/NavbarMegaMenu.js";
import { NavbarContext } from "../Navbar/index.js";
/**
 * The `Nav.MegaMenu` component is used to create a mega menu.
 * @see https://rsuitejs.com/components/navbar/#mega-menu
 * @version 6.0.0
 */
const NavMegaMenu = /*#__PURE__*/React.forwardRef((props, ref) => {
  const navbar = useContext(NavbarContext);
  if (!navbar) {
    console.error('<Nav.MegaMenu> should be used within a <Navbar> component. Use https://rsuitejs.com/components/navbar/#mega-menu for more information.');
    return null;
  }
  return /*#__PURE__*/React.createElement(NavbarMegaMenu, _extends({
    ref: ref
  }, props));
});
NavMegaMenu.displayName = 'NavMegaMenu';
export default NavMegaMenu;