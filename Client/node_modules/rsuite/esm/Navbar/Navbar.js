'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import NavbarBrand from "./NavbarBrand.js";
import NavbarContent from "./NavbarContent.js";
import NavbarToggle from "./NavbarToggle.js";
import NavbarDrawer from "./NavbarDrawer.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useEventCallback, useUniqueId, useControlled } from "../internals/hooks/index.js";
import { NavbarContext } from "./NavbarContext.js";
const Subcomponents = {
  Brand: NavbarBrand,
  Content: NavbarContent,
  Toggle: NavbarToggle,
  Drawer: NavbarDrawer
};

/**
 * The `Navbar` component is a wrapper that positions navigation elements.
 * @see https://rsuitejs.com/components/navbar
 */
const Navbar = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Navbar', props);
  const {
    className,
    as = 'nav',
    classPrefix = 'navbar',
    appearance = 'default',
    drawerOpen,
    onDrawerOpenChange,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [open, setOpen] = useControlled(drawerOpen, false);
  const handleToggle = useEventCallback(nextOpen => {
    setOpen(nextOpen);
    onDrawerOpenChange === null || onDrawerOpenChange === void 0 || onDrawerOpenChange(nextOpen);
  });
  const navbarId = useUniqueId('navbar-');
  const context = useMemo(() => ({
    appearance,
    open,
    navbarId,
    onToggle: handleToggle
  }), [appearance, navbarId, open]);
  return /*#__PURE__*/React.createElement(NavbarContext.Provider, {
    value: context
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "data-appearance": appearance
  }, rest)));
}, Subcomponents);
Navbar.displayName = 'Navbar';
export default Navbar;