'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import NavbarItem from "./NavbarItem.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Menu> call
 *
 * <Nav>
 *   <Nav.Menu> -> This will render <NavDropdown> component that renders a <NavDropdownToggle>
 *   </Nav.Menu>
 * </Nav>
 */
const NavbarDropdownToggle = forwardRef((props, ref) => {
  const {
    as = NavbarItem,
    className,
    classPrefix = 'navbar-item',
    renderToggle,
    children,
    noCaret,
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
  const toggle = /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }), children, !noCaret && /*#__PURE__*/React.createElement(ArrowDownLineIcon, {
    className: prefix('caret')
  }));
  return renderToggle ? renderToggle(rest, ref) : toggle;
});
NavbarDropdownToggle.displayName = 'Navbar.Dropdown.Toggle';
export default NavbarDropdownToggle;