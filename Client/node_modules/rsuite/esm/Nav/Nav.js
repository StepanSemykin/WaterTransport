'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useMemo } from 'react';
import NavContext from "./NavContext.js";
import Menubar from "../internals/Menu/Menubar.js";
import NavDropdown from "./NavDropdown.js";
import NavMenu from "./NavMenu.js";
import NavMegaMenu from "./NavMegaMenu.js";
import NavDropdownItem from "./NavDropdownItem.js";
import NavDropdownMenu from "./NavDropdownMenu.js";
import AdaptiveNavItem from "./AdaptiveNavItem.js";
import Box from "../internals/Box/index.js";
import { forwardRef, deprecateComponent } from "../internals/utils/index.js";
import { useStyles, useCustom, useEnsuredRef, useControlled } from "../internals/hooks/index.js";
import { NavbarContext } from "../Navbar/NavbarContext.js";
import { SidenavContext } from "../Sidenav/SidenavContext.js";
const DeprecatedNavDropdown = deprecateComponent(NavDropdown, '<Nav.Dropdown> is deprecated, use <Nav.Menu> instead.');
DeprecatedNavDropdown.Menu = deprecateComponent(NavDropdownMenu, '<Nav.Dropdown.Menu> is deprecated, use <Nav.Menu> instead');
DeprecatedNavDropdown.Item = deprecateComponent(NavDropdownItem, '<Nav.Dropdown.Item> is deprecated, use <Nav.Item> instead');
const Subcomponents = {
  /**
   * @deprecated Use <Nav.Menu> instead.
   */
  Dropdown: DeprecatedNavDropdown,
  Item: AdaptiveNavItem,
  Menu: NavMenu,
  MegaMenu: NavMegaMenu
};

/**
 * The `Nav` component is used to create navigation links.
 * @see https://rsuitejs.com/components/nav
 */
const Nav = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Nav', props);
  const {
    as,
    classPrefix = 'nav',
    appearance = 'default',
    vertical,
    justified,
    reversed,
    className,
    children,
    activeKey: activeKeyProp,
    defaultActiveKey,
    onSelect: onSelectProp,
    ...rest
  } = propsWithDefaults;
  const sidenav = useContext(SidenavContext);

  // Whether inside a <Navbar>
  const navbar = useContext(NavbarContext);
  const menubarRef = useEnsuredRef(ref);
  const {
    withPrefix,
    merge,
    rootPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, rootPrefix({
    'navbar-nav': navbar,
    'sidenav-nav': sidenav
  }), withPrefix());
  const dataAttributes = {
    'data-appearance': appearance,
    'data-reversed': reversed,
    'data-justified': justified,
    'data-direction': vertical || sidenav ? 'vertical' : 'horizontal'
  };
  const {
    activeKey: activeKeyFromSidenav,
    onSelect: onSelectFromSidenav
  } = sidenav || {};
  const [activeKey, setActiveKey] = useControlled(activeKeyProp !== null && activeKeyProp !== void 0 ? activeKeyProp : activeKeyFromSidenav, defaultActiveKey);
  const contextValue = useMemo(() => ({
    activeKey,
    onSelect: (eventKey, event) => {
      setActiveKey(eventKey);
      onSelectProp === null || onSelectProp === void 0 || onSelectProp(eventKey, event);
      onSelectFromSidenav === null || onSelectFromSidenav === void 0 || onSelectFromSidenav(eventKey, event);
    }
  }), [activeKey, onSelectFromSidenav, onSelectProp, setActiveKey]);
  if (sidenav !== null && sidenav !== void 0 && sidenav.expanded) {
    return /*#__PURE__*/React.createElement(NavContext.Provider, {
      value: contextValue
    }, /*#__PURE__*/React.createElement("ul", _extends({
      ref: ref,
      className: classes
    }, dataAttributes, rest), children));
  }
  const hasWaterline = appearance !== 'default';

  // If inside a collapsed <Sidenav>, render an ARIA `menubar` (vertical)
  if (sidenav) {
    return /*#__PURE__*/React.createElement(NavContext.Provider, {
      value: contextValue
    }, /*#__PURE__*/React.createElement(Menubar, {
      vertical: !!sidenav
    }, (menubar, ref) => /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: ref,
      className: classes
    }, dataAttributes, menubar, rest), children)));
  }
  return /*#__PURE__*/React.createElement(NavContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: menubarRef,
    className: classes
  }, dataAttributes, rest), children, hasWaterline && /*#__PURE__*/React.createElement("div", {
    className: prefix('bar')
  })));
}, Subcomponents);
Nav.displayName = 'Nav';
export default Nav;