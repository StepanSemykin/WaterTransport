'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import Ripple from "../internals/Ripple/index.js";
import SafeAnchor from "../internals/SafeAnchor/index.js";
import NavContext from "./NavContext.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, shallowEqual } from "../internals/utils/index.js";
/**
 * The `Nav.Item` component is used to create navigation links.
 *
 * - When used as direct child of `<Nav>`, render the NavItem
 * - When used within a `<Nav.Menu>`, render the NavDropdownItem
 * @see https://rsuitejs.com/components/nav
 *
 */
const NavItem = forwardRef((props, ref) => {
  const nav = useContext(NavContext);
  if (!nav) {
    throw new Error('<Nav.Item> must be rendered within a <Nav> component.');
  }
  const {
    as = SafeAnchor,
    active: activeProp,
    disabled,
    eventKey,
    className,
    classPrefix = 'nav-item',
    style,
    children,
    icon,
    divider,
    panel,
    onClick,
    onSelect: onSelectProp,
    ...rest
  } = props;
  const {
    activeKey,
    onSelect: onSelectFromNav
  } = nav;
  const active = activeProp !== null && activeProp !== void 0 ? activeProp : !isNil(eventKey) && shallowEqual(eventKey, activeKey);
  const emitSelect = useCallback(event => {
    onSelectProp === null || onSelectProp === void 0 || onSelectProp(eventKey, event);
    onSelectFromNav === null || onSelectFromNav === void 0 || onSelectFromNav(eventKey, event);
  }, [eventKey, onSelectProp, onSelectFromNav]);
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const handleClick = useCallback(event => {
    if (!disabled) {
      emitSelect(event);
      onClick === null || onClick === void 0 || onClick(event);
    }
  }, [disabled, emitSelect, onClick]);
  if (divider) {
    return /*#__PURE__*/React.createElement("div", _extends({
      ref: ref,
      role: "separator",
      style: style,
      className: merge(className, prefix('divider'))
    }, rest));
  }
  if (panel) {
    return /*#__PURE__*/React.createElement("div", _extends({
      ref: ref,
      style: style,
      className: merge(className, prefix('panel'))
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    tabIndex: disabled ? -1 : undefined,
    className: classes,
    onClick: handleClick,
    style: style,
    "aria-selected": active || undefined,
    "data-active": active || undefined,
    "data-disabled": disabled
  }, rest), icon && /*#__PURE__*/React.cloneElement(icon, {
    className: classNames(prefix('icon'), icon.props.className)
  }), children, /*#__PURE__*/React.createElement(Ripple, null));
});
NavItem.displayName = 'Nav.Item';
export default NavItem;