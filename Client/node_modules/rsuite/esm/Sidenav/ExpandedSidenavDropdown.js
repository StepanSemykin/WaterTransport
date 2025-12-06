'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useCallback } from 'react';
import omit from 'lodash/omit';
import NavContext from "../Nav/NavContext.js";
import SidenavDropdownCollapse from "./SidenavDropdownCollapse.js";
import Disclosure from "../internals/Disclosure/Disclosure.js";
import SidenavDropdownToggle from "./SidenavDropdownToggle.js";
import Box from "../internals/Box/index.js";
import { useStyles, useInternalId } from "../internals/hooks/index.js";
import { forwardRef, kebabPlace, mergeRefs } from "../internals/utils/index.js";
import { SidenavContext } from "./SidenavContext.js";
import { NavMenuContext } from "../Nav/NavMenu.js";
const ExpandedSidenavDropdown = forwardRef((props, ref) => {
  const sidenav = useContext(SidenavContext);
  const nav = useContext(NavContext);
  const navMenu = useContext(NavMenuContext);
  if (!sidenav || !nav || !navMenu) {
    throw new Error('<SidenavDropdown> component is not supposed to be used standalone. Use <Nav.Menu> inside <Sidenav> instead.');
  }
  const {
    as,
    title,
    children,
    className,
    menuStyle,
    disabled,
    classPrefix = 'dropdown',
    placement = 'bottomStart',
    toggleClassName,
    icon,
    eventKey,
    toggleAs,
    noCaret,
    style,
    open: openProp,
    renderToggle,
    onOpen,
    onClose,
    onToggle,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const internalId = useInternalId('SidenavDropdown');
  const uniqueKey = eventKey !== null && eventKey !== void 0 ? eventKey : internalId;
  const {
    openKeys = [],
    onOpenChange
  } = sidenav;
  const [{
    items
  }] = navMenu;
  const hasSelectedItems =
  // has items that is active indicated by <Nav activeKey>
  nav.activeKey && items.some(item => item.eventKey === nav.activeKey) ||
  // has items that is active indicated by <Nav.Item active>
  items.some(item => item.active);
  const handleToggleDisclosure = useCallback((open, event) => {
    if (open) {
      onClose === null || onClose === void 0 || onClose();
    } else {
      onOpen === null || onOpen === void 0 || onOpen();
    }
    onToggle === null || onToggle === void 0 || onToggle(open);
    onOpenChange === null || onOpenChange === void 0 || onOpenChange(uniqueKey, event);
  }, [onClose, onOpen, onToggle, uniqueKey, onOpenChange]);
  const open = openProp !== null && openProp !== void 0 ? openProp : openKeys.includes(uniqueKey);
  return /*#__PURE__*/React.createElement(Disclosure, {
    open: open,
    onToggle: handleToggleDisclosure
  }, ({
    open
  }, containerRef) => {
    const classes = merge(className, withPrefix());
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: mergeRefs(ref, containerRef),
      style: style,
      className: classes,
      "data-event-key": eventKey,
      "data-expanded": open,
      "data-placement": kebabPlace(placement),
      "data-active-descendant": hasSelectedItems
    }, rest), /*#__PURE__*/React.createElement(Disclosure.Button, null, (buttonProps, buttonRef) => /*#__PURE__*/React.createElement(SidenavDropdownToggle, _extends({
      ref: buttonRef,
      as: toggleAs,
      noCaret: noCaret,
      className: toggleClassName,
      renderToggle: renderToggle,
      disabled: disabled,
      icon: icon,
      placement: placement
    }, omit(buttonProps, ['open'])), title)), /*#__PURE__*/React.createElement(Disclosure.Content, null, ({
      open
    }) => /*#__PURE__*/React.createElement(SidenavDropdownCollapse, {
      open: open,
      style: menuStyle
    }, children)));
  });
});
ExpandedSidenavDropdown.displayName = 'Sidenav.Dropdown';
export default ExpandedSidenavDropdown;