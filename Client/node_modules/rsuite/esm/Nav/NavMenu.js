'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useReducer } from 'react';
import NavDropdown from "./NavDropdown.js";
import NavDropdownMenu from "./NavDropdownMenu.js";
import NavbarDropdown from "../Navbar/NavbarDropdown.js";
import NavbarDropdownMenu from "../Navbar/NavbarDropdownMenu.js";
import SidenavDropdown from "../Sidenav/SidenavDropdown.js";
import { NavbarContext } from "../Navbar/index.js";
import { SidenavContext } from "../Sidenav/SidenavContext.js";
export const NavMenuContext = /*#__PURE__*/React.createContext(null);
NavMenuContext.displayName = 'NavMenu.Context';
export let NavMenuActionType = /*#__PURE__*/function (NavMenuActionType) {
  NavMenuActionType[NavMenuActionType["RegisterItem"] = 0] = "RegisterItem";
  NavMenuActionType[NavMenuActionType["UnregisterItem"] = 1] = "UnregisterItem";
  return NavMenuActionType;
}({});
const initilNavMenuState = {
  items: []
};
const reducer = (state, action) => {
  switch (action.type) {
    case NavMenuActionType.RegisterItem:
      return {
        ...state,
        items: [...state.items.filter(item => item._id !== action.payload._id), action.payload]
      };
    case NavMenuActionType.UnregisterItem:
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload._id)
      };
    default:
      throw new Error('Unrecognizable action type: ' + action.type);
  }
};

/**
 * The `Nav.Menu` component is used to create navigation menus.
 *
 * - When used as direct child of `<Nav>`, render the NavDropdown
 * - When used within another `<Nav.Menu>`, render the NavDropdownMenu
 *
 * @see https://rsuitejs.com/components/nav
 */
const NavMenu = /*#__PURE__*/React.forwardRef((props, ref) => {
  const parentNavMenu = useContext(NavMenuContext);
  const navMenuContext = useReducer(reducer, initilNavMenuState);
  const navbar = useContext(NavbarContext);
  const sidenav = useContext(SidenavContext);
  if (!parentNavMenu) {
    if (sidenav) {
      return /*#__PURE__*/React.createElement(NavMenuContext.Provider, {
        value: navMenuContext
      }, /*#__PURE__*/React.createElement(SidenavDropdown, _extends({
        ref: ref
      }, props)));
    }
    if (navbar) {
      return /*#__PURE__*/React.createElement(NavMenuContext.Provider, {
        value: navMenuContext
      }, /*#__PURE__*/React.createElement(NavbarDropdown, _extends({
        ref: ref
      }, props)));
    }
    return /*#__PURE__*/React.createElement(NavMenuContext.Provider, {
      value: navMenuContext
    }, /*#__PURE__*/React.createElement(NavDropdown, _extends({
      ref: ref
    }, props)));
  }
  if (navbar) {
    return /*#__PURE__*/React.createElement(NavbarDropdownMenu, _extends({
      ref: ref
    }, props));
  }
  return /*#__PURE__*/React.createElement(NavDropdownMenu, _extends({
    ref: ref
  }, props));
});
NavMenu.displayName = 'Nav.Menu';
export default NavMenu;