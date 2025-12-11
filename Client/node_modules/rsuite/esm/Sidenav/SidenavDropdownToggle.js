'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import SidenavItem from "./SidenavItem.js";
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
const SidenavDropdownToggle = forwardRef((props, ref) => {
  const {
    as: Component = SidenavItem,
    classPrefix = 'sidenav-dropdown-toggle',
    className,
    renderToggle,
    children,
    noCaret,
    ...rest
  } = props;
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const toggle = /*#__PURE__*/React.createElement(Component, _extends({
    className: classes,
    ref: ref,
    tooltip: children
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: prefix('title')
  }, children), !noCaret && /*#__PURE__*/React.createElement(ArrowRightLineIcon, {
    className: prefix('caret')
  }));
  return renderToggle ? renderToggle(rest, ref) : toggle;
});
SidenavDropdownToggle.displayName = 'Sidenav.Dropdown.Toggle';
export default SidenavDropdownToggle;