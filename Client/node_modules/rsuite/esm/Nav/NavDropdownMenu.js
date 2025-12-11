'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext } from 'react';
import omit from 'lodash/omit';
import Menu from "../internals/Menu/Menu.js";
import MenuItem from "../internals/Menu/MenuItem.js";
import PagePreviousIcon from '@rsuite/icons/PagePrevious';
import PageNextIcon from '@rsuite/icons/PageNext';
import NavContext from "./NavContext.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { mergeRefs } from "../internals/utils/index.js";
/**
 * @private
 */
const NavDropdownMenu = /*#__PURE__*/React.forwardRef((props, ref) => {
  const nav = useContext(NavContext);
  if (!nav) {
    throw new Error('<Nav.Dropdown.Menu> should be used within a <Nav> component.');
  }
  const {
    onToggle,
    eventKey,
    title,
    classPrefix = 'dropdown-menu',
    children,
    openDirection = 'end',
    noCaret,
    ...rest
  } = props;
  const {
    rtl
  } = useCustom();
  const handleToggleSubmenu = useCallback((open, event) => {
    onToggle === null || onToggle === void 0 || onToggle(open, eventKey, event);
  }, [eventKey, onToggle]);
  const {
    prefix
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

  // Parent menu exists. This is a submenu.
  // Should render a `menuitem` that controls this submenu.
  const {
    icon,
    className,
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
        "data-focus": active,
        "data-active": selected,
        "data-disabled": disabled,
        "data-with-icon": icon,
        "data-event-key": eventKey,
        "data-event-key-type": typeof eventKey
      }, menuitem, omit(menuButtonProps, ['role'])), icon && /*#__PURE__*/React.cloneElement(icon, {
        className: prefix('menu-icon')
      }), title, !noCaret && /*#__PURE__*/React.createElement(Icon, {
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
        hidden: !open,
        "data-direction": openDirection
      }, popupProps, menuProps), children);
    },
    onToggleMenu: handleToggleSubmenu
  }, ({
    open,
    ...menuContainer
  }, menuContainerRef) => {
    const classes = mergeItemClassNames(className, withItemClassPrefix('submenu'));
    return /*#__PURE__*/React.createElement("li", _extends({
      ref: mergeRefs(ref, menuContainerRef),
      className: classes,
      "data-open": open,
      "data-disabled": disabled
    }, menuContainer));
  });
});
NavDropdownMenu.displayName = 'Nav.Dropdown.Menu';
export default NavDropdownMenu;