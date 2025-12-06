'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import NavItem from "./NavItem.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Menu> call
 *
 * <Nav>
 *   <Nav.Menu> -> This will render <NavDropdown> component that renders a <NavDropdownToggle>
 *   </Nav.Menu>
 * </Nav>
 */
const NavDropdownToggle = forwardRef((props, ref) => {
  const {
    as = NavItem,
    className,
    classPrefix = 'dropdown-toggle',
    renderToggle,
    children,
    noCaret,
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const {
    prefix: prefixNavItem
  } = useStyles('nav-item');
  const classes = merge(className, withPrefix({
    'no-caret': noCaret
  }));
  const toggle = /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }), children, !noCaret && /*#__PURE__*/React.createElement(ArrowDownLineIcon, {
    className: prefixNavItem('caret')
  }));
  return renderToggle ? renderToggle(rest, ref) : toggle;
});
NavDropdownToggle.displayName = 'Nav.Dropdown.Toggle';
export default NavDropdownToggle;