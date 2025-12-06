'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useMemo } from 'react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import SidenavDropdownToggle from "./SidenavDropdownToggle.js";
import Menu from "../internals/Menu/Menu.js";
import MenuItem from "../internals/Menu/MenuItem.js";
import ExpandedSidenavDropdown from "./ExpandedSidenavDropdown.js";
import NavContext from "../Nav/NavContext.js";
import NavDropdownItem from "../Nav/NavDropdownItem.js";
import NavDropdownMenu from "../Nav/NavDropdownMenu.js";
import Box from "../internals/Box/index.js";
import { NavMenuContext } from "../Nav/NavMenu.js";
import { forwardRef, mergeRefs, kebabPlace } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { SidenavContext } from "./SidenavContext.js";
const Subcomponents = {
  Item: NavDropdownItem,
  Menu: NavDropdownMenu
};

/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Menu> within a <Sidenav>
 *
 * <Sidenav>
 *   <Nav>
 *     <Nav.Menu> -> This submenu will render <SidenavDropdown> component
 *     </Nav.Menu>
 *   </Nav>
 * </Sidenav>
 */
const SidenavDropdown = forwardRef((props, ref) => {
  const sidenav = useContext(SidenavContext);
  const nav = useContext(NavContext);
  const navMenu = useContext(NavMenuContext);
  if (!sidenav || !nav || !navMenu) {
    throw new Error('<Sidenav.Dropdown> must be rendered within a <Nav> component within a <Sidenav> component.');
  }
  const {
    as,
    title,
    eventKey,
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
    onClose,
    onOpen,
    onToggle,
    ...toggleProps
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const {
    withPrefix: withMenuClassPrefix,
    merge: mergeMenuClassName
  } = useStyles('dropdown-menu');
  const {
    withPrefix: withNavItemClassPrefix,
    merge: mergeNavItemClassNames
  } = useStyles('nav-item');
  const [{
    items
  }] = navMenu;
  const hasSelectedItems =
  // has items that is active indicated by <Nav activeKey>
  nav.activeKey && items.some(item => item.eventKey === nav.activeKey) ||
  // has items that is active indicated by <Nav.Item active>
  items.some(item => item.active);
  const menuButtonTriggers = useMemo(() => {
    if (!trigger) {
      return undefined;
    }
    const triggerMap = {
      hover: 'mouseover',
      click: 'click',
      contextMenu: 'contextmenu'
    };
    if (!Array.isArray(trigger)) {
      return [triggerMap[trigger]];
    }
    return trigger.map(t => triggerMap[t]);
  }, [trigger]);

  // Render a disclosure when inside expanded <Sidenav>
  if (sidenav.expanded) {
    return /*#__PURE__*/React.createElement(ExpandedSidenavDropdown, _extends({
      ref: ref
    }, props));
  }
  const renderMenuButton = (menuButtonProps, buttonRef) => /*#__PURE__*/React.createElement(MenuItem, {
    disabled: disabled
  }, ({
    active,
    ...menuitemProps
  }, menuitemRef) => {
    return /*#__PURE__*/React.createElement(SidenavDropdownToggle, _extends({
      ref: mergeRefs(buttonRef, menuitemRef),
      as: toggleAs,
      className: mergeNavItemClassNames(toggleClassName, withNavItemClassPrefix({
        focus: active
      }))
    }, menuButtonProps, omit(menuitemProps, ['onClick']), omit(toggleProps, 'data-testid')), title);
  });
  return /*#__PURE__*/React.createElement(Menu, {
    menuButtonText: title,
    renderMenuButton: renderMenuButton,
    openMenuOn: menuButtonTriggers,
    renderMenuPopup: ({
      open,
      ...popupProps
    }, popupRef) => {
      const menuClassName = mergeMenuClassName(className, withMenuClassPrefix({}));
      // When inside a collapsed <Sidenav>, render a header in menu
      const showHeader = !!sidenav;
      return /*#__PURE__*/React.createElement("ul", _extends({
        ref: popupRef,
        className: menuClassName,
        style: menuStyle,
        hidden: !open
      }, popupProps), showHeader && /*#__PURE__*/React.createElement("div", {
        className: prefix('header')
      }, title), children);
    },
    onToggleMenu: (open, event) => {
      onToggle === null || onToggle === void 0 || onToggle(open, eventKey, event);
      sidenav === null || sidenav === void 0 || sidenav.onOpenChange(eventKey, event);
      if (open) {
        onOpen === null || onOpen === void 0 || onOpen();
      } else {
        onClose === null || onClose === void 0 || onClose();
      }
    }
  }, ({
    open,
    ...menuContainer
  }, menuContainerRef) => {
    const classes = merge(className, withPrefix('submenu'));
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: mergeRefs(ref, menuContainerRef),
      className: classes,
      style: style,
      "data-open": open,
      "data-disabled": disabled,
      "data-placement": kebabPlace(placement),
      "data-active-descendant": hasSelectedItems
    }, menuContainer, pick(toggleProps, ['data-testid'])));
  });
}, Subcomponents);
SidenavDropdown.displayName = 'Sidenav.Dropdown';
export default SidenavDropdown;