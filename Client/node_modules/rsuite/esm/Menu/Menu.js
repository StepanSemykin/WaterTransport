'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Menubar from "../internals/Menu/Menubar.js";
import MenuContext from "./MenuContext.js";
import MenuItem from "./MenuItem.js";
import MenuSeparator from "./MenuSeparator.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { mergeRefs, forwardRef } from "../internals/utils/index.js";
const Subcomponents = {
  Item: MenuItem,
  Separator: MenuSeparator
};

/**
 * The `<Menu>` component is used to create a menu.
 *
 * @see https://rsuitejs.com/components/menu
 */
const Menu = forwardRef((props, ref) => {
  const {
    as = 'ul',
    activeKey,
    classPrefix = 'menu',
    className,
    children,
    onSelect,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const contextValue = useMemo(() => ({
    activeKey,
    onSelect
  }), [activeKey, onSelect]);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Menubar, {
    vertical: true
  }, (menubar, menubarRef) => /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, menubar, rest, {
    ref: mergeRefs(menubarRef, ref),
    className: classes,
    role: "menu"
  }), children)));
}, Subcomponents);
Menu.displayName = 'Menu';
export default Menu;