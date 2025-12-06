'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import castArray from 'lodash/castArray';
import omit from 'lodash/omit';
import Disclosure from "../internals/Disclosure/Disclosure.js";
import NavDropdownItem from "../Nav/NavDropdownItem.js";
import NavDropdownMenu from "../Nav/NavDropdownMenu.js";
import NavbarDropdownToggle from "./NavbarDropdownToggle.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, kebabPlace } from "../internals/utils/index.js";
import { NavbarContext } from "./NavbarContext.js";
const Subcomponents = {
  Item: NavDropdownItem,
  Menu: NavDropdownMenu
};

/**
 * @private
 */
const NavbarDropdown = forwardRef((props, ref) => {
  const navbar = useContext(NavbarContext);
  if (!navbar) {
    throw new Error('<Navbar.Dropdown> should be used within a <Navbar> component.');
  }
  const {
    as,
    title,
    onClose,
    onOpen,
    onToggle,
    trigger = 'click',
    placement = 'bottomStart',
    toggleAs,
    toggleClassName,
    classPrefix = 'dropdown',
    className,
    disabled,
    children,
    menuStyle,
    style,
    ...toggleProps
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const {
    withPrefix: withMenuClassPrefix,
    merge: mergeMenuClassName
  } = useStyles('dropdown-menu');
  return /*#__PURE__*/React.createElement(Disclosure, {
    trigger: castArray(trigger),
    hideOnClickOutside: true,
    onToggle: open => {
      onToggle === null || onToggle === void 0 || onToggle(open);
      if (open) {
        onOpen === null || onOpen === void 0 || onOpen();
      } else {
        onClose === null || onClose === void 0 || onClose();
      }
    }
  }, ({
    open,
    ...props
  }, containerRef) => {
    const classes = merge(className, withPrefix());
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: mergeRefs(ref, containerRef),
      className: classes,
      style: style,
      "data-open": open,
      "data-disabled": disabled,
      "data-placement": kebabPlace(placement)
    }, props), /*#__PURE__*/React.createElement(Disclosure.Button, null, (buttonProps, buttonRef) => /*#__PURE__*/React.createElement(NavbarDropdownToggle, _extends({
      ref: buttonRef,
      as: toggleAs,
      className: toggleClassName,
      placement: placement,
      disabled: disabled
    }, omit(buttonProps, ['open']), toggleProps), title)), /*#__PURE__*/React.createElement(Disclosure.Content, null, ({
      open
    }, elementRef) => {
      const menuClassName = mergeMenuClassName(className, withMenuClassPrefix());
      return /*#__PURE__*/React.createElement("ul", {
        ref: elementRef,
        className: menuClassName,
        style: menuStyle,
        hidden: !open
      }, children);
    }));
  });
}, Subcomponents);
NavbarDropdown.displayName = 'Navbar.Dropdown';
export default NavbarDropdown;