'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useEffect } from 'react';
import NavItem from "./NavItem.js";
import NavDropdownItem from "./NavDropdownItem.js";
import NavbarDropdownItem from "../Navbar/NavbarDropdownItem.js";
import NavbarItem from "../Navbar/NavbarItem.js";
import NavContext from "./NavContext.js";
import SidenavDropdownItem from "../Sidenav/SidenavDropdownItem.js";
import SidenavItem from "../Sidenav/SidenavItem.js";
import { forwardRef } from "../internals/utils/index.js";
import { useInternalId } from "../internals/hooks/index.js";
import { NavbarContext } from "../Navbar/NavbarContext.js";
import { SidenavContext } from "../Sidenav/SidenavContext.js";
import { NavMenuActionType, NavMenuContext } from "./NavMenu.js";

/**
 * The <Nav.Item> API
 * When used as direct child of <Nav>, render the NavItem
 * When used within a <Nav.Menu>, render the NavDropdownItem
 */
const AdaptiveNavItem = forwardRef((props, ref) => {
  const nav = useContext(NavContext);
  if (!nav) {
    throw new Error('<Nav.Item> must be rendered within a <Nav> component.');
  }
  const parentNavMenu = useContext(NavMenuContext);
  const navbar = useContext(NavbarContext);
  const sidenav = useContext(SidenavContext);
  const [, dispatch] = parentNavMenu !== null && parentNavMenu !== void 0 ? parentNavMenu : [];
  const _id = useInternalId('Nav.Item');
  useEffect(() => {
    if (dispatch) {
      var _props$active;
      dispatch({
        type: NavMenuActionType.RegisterItem,
        payload: {
          _id,
          eventKey: props.eventKey,
          active: (_props$active = props.active) !== null && _props$active !== void 0 ? _props$active : false
        }
      });
      return () => {
        dispatch({
          type: NavMenuActionType.UnregisterItem,
          payload: {
            _id
          }
        });
      };
    }
  }, [dispatch, _id, props.eventKey, props.active]);
  if (parentNavMenu) {
    if (sidenav) {
      return /*#__PURE__*/React.createElement(SidenavDropdownItem, _extends({
        ref: ref
      }, props));
    }
    if (navbar) {
      return /*#__PURE__*/React.createElement(NavbarDropdownItem, _extends({
        ref: ref
      }, props));
    }
    return /*#__PURE__*/React.createElement(NavDropdownItem, _extends({
      ref: ref
    }, props));
  }
  if (sidenav) {
    return /*#__PURE__*/React.createElement(SidenavItem, _extends({
      ref: ref
    }, props));
  }
  if (navbar) {
    return /*#__PURE__*/React.createElement(NavbarItem, _extends({
      ref: ref
    }, props));
  }
  return /*#__PURE__*/React.createElement(NavItem, _extends({
    ref: ref
  }, props));
});
AdaptiveNavItem.displayName = 'Nav.Item';
export default AdaptiveNavItem;