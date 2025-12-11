'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext, useMemo } from 'react';
import omit from 'lodash/omit';
import Menu from "../internals/Menu/Menu.js";
import MenuItem from "../internals/Menu/MenuItem.js";
import Menubar from "../internals/Menu/Menubar.js";
import PagePreviousIcon from '@rsuite/icons/PagePrevious';
import PageNextIcon from '@rsuite/icons/PageNext';
import DropdownContext from "./DropdownContext.js";
import Nav from "../Nav/index.js";
import NavContext from "../Nav/NavContext.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { mergeRefs, warnOnce } from "../internals/utils/index.js";
/**
 * The `<Dropdown.Menu>` API
 *
 * @description
 * Note the difference between this component and `<Menu>` component:
 * `<Menu>` is used for ARIA menu control logic and is used internally only.
 * This component is only used for supporting submenu syntax and is
 * assigned to Dropdown.Menu
 *
 * @example
 *
 * <Dropdown>
 *   <Dropdown.Item>Item 1</Dropdown.Item>
 *   <Dropdown.Menu title="Submenu">
 *     <Dropdown.Item>Sub item</Dropdown.Item>
 *   </Dropdown.Menu>
 * </Dropdown>
 */
const DropdownMenu = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    activeKey,
    classPrefix = 'dropdown-menu',
    className,
    children,
    eventKey,
    title,
    onSelect,
    onToggle,
    ...rest
  } = props;
  const nav = useContext(NavContext);
  const dropdown = useContext(DropdownContext);
  const {
    rtl
  } = useCustom();
  const handleToggleSubmenu = useCallback((_, event) => {
    onToggle === null || onToggle === void 0 || onToggle(eventKey, event);
  }, [eventKey, onToggle]);
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const {
    withPrefix: withMenuClassPrefix,
    merge: mergeMenuClassName
  } = useStyles('dropdown-menu');
  const {
    merge: mergeItemClassNames,
    withPrefix: withItemClassPrefix,
    prefix: prefixItemClassName
  } = useStyles('dropdown-item');
  const contextValue = useMemo(() => ({
    activeKey,
    onSelect
  }), [activeKey, onSelect]);

  // If rendered within a <Nav>
  // Suggest <Nav.Menu>
  if (nav) {
    warnOnce('Usage of <Dropdown.Menu> within <Nav> is deprecated. Replace with <Nav.Menu>');
    return /*#__PURE__*/React.createElement(Nav.Menu, _extends({
      ref: ref
    }, props));
  }

  // <Dropdown.Menu> is used outside of <Dropdown>
  // renders a vertical `menubar`
  if (!dropdown) {
    const classes = merge(className, withPrefix());
    return /*#__PURE__*/React.createElement(DropdownContext.Provider, {
      value: contextValue
    }, /*#__PURE__*/React.createElement(Menubar, {
      vertical: true
    }, (menubar, menubarRef) => /*#__PURE__*/React.createElement("ul", _extends({
      ref: mergeRefs(menubarRef, ref),
      className: classes
    }, menubar, rest), children)));
  }

  // Parent menu exists. This is a submenu.
  // Should render a `menuitem` that controls this submenu.
  const {
    icon,
    disabled,
    ...menuProps
  } = omit(rest, ['trigger']);
  const Icon = rtl ? PagePreviousIcon : PageNextIcon;
  return /*#__PURE__*/React.createElement(Menu, {
    openMenuOn: ['mouseover', 'click'],
    renderMenuButton: ({
      open,
      ...menuButtonProps
    }, buttonRef) => /*#__PURE__*/React.createElement(MenuItem, {
      disabled: disabled
    }, ({
      selected,
      active,
      ...menuitem
    }, menuitemRef) => {
      const classes = mergeItemClassNames(className, prefixItemClassName`toggle`, withItemClassPrefix());
      return /*#__PURE__*/React.createElement("div", _extends({
        ref: mergeRefs(buttonRef, menuitemRef),
        className: classes,
        "data-open": open,
        "data-disabled": disabled,
        "data-focus": active,
        "data-active": selected,
        "data-with-icon": icon,
        "data-event-key": eventKey,
        "data-event-key-type": typeof eventKey
      }, menuitem, omit(menuButtonProps, ['role'])), icon && /*#__PURE__*/React.cloneElement(icon, {
        className: prefix('menu-icon')
      }), title, /*#__PURE__*/React.createElement(Icon, {
        className: prefix`toggle-icon`
      }));
    }),
    renderMenuPopup: ({
      open,
      ...popupProps
    }, popupRef) => {
      const menuClassName = mergeMenuClassName(className, withMenuClassPrefix());
      return /*#__PURE__*/React.createElement("ul", _extends({
        ref: popupRef,
        className: menuClassName,
        hidden: !open
      }, popupProps, menuProps), children);
    },
    onToggleMenu: handleToggleSubmenu
  }, ({
    open,
    ...menuContainer
  }, menuContainerRef) => {
    const classes = mergeItemClassNames(className, withItemClassPrefix({
      submenu: true
    }));
    return /*#__PURE__*/React.createElement("li", _extends({
      ref: mergeRefs(ref, menuContainerRef),
      className: classes,
      "data-open": open,
      "data-disabled": disabled
    }, menuContainer));
  });
});
DropdownMenu.displayName = 'Dropdown.Menu';
export default DropdownMenu;