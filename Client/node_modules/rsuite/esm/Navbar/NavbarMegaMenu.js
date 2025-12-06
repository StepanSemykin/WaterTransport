'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import Whisper from "../Whisper/index.js";
import Popover from "../Popover/index.js";
import NavbarItem from "./NavbarItem.js";
import { useStyles } from "../internals/hooks/index.js";
const NavbarMegaMenu = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    as: Component = NavbarItem,
    className,
    classPrefix = 'mega-menu',
    children,
    title,
    open,
    placement = 'autoVertical',
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const renderMenu = useCallback((menuProps, ref) => {
    const {
      onClose,
      className
    } = menuProps || {};
    return /*#__PURE__*/React.createElement(Popover, {
      ref: ref,
      full: true,
      arrow: false,
      className: className
    }, typeof children === 'function' ? children({
      onClose
    }) : children);
  }, [children]);
  return /*#__PURE__*/React.createElement(Whisper, {
    preventOverflow: true,
    placement: placement,
    trigger: "click",
    speaker: renderMenu,
    open: open
  }, /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref,
    className: classes
  }, rest), title, /*#__PURE__*/React.createElement(ArrowDownLineIcon, {
    className: prefix`toggle-icon`
  })));
});
NavbarMegaMenu.displayName = 'NavbarMegaMenu';
export default NavbarMegaMenu;