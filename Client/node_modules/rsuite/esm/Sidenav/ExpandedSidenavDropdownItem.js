'use client';
import React, { useCallback, useContext } from 'react';
import isNil from 'lodash/isNil';
import Ripple from "../internals/Ripple/index.js";
import SafeAnchor from "../internals/SafeAnchor/index.js";
import NavContext from "../Nav/NavContext.js";
import { forwardRef, createChainedFunction, shallowEqual } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { SidenavContext } from "./SidenavContext.js";
import { useRenderMenuItem } from "../internals/Menu/useRenderMenuItem.js";
/**
 * Tree View Node
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#TreeView
 */
const ExpandedSidenavDropdownItem = forwardRef((props, ref) => {
  const sidenav = useContext(SidenavContext);
  const nav = useContext(NavContext);
  if (!sidenav || !nav) {
    throw new Error('<SidenavDropdownItem> component is not supposed to be used standalone. Use <Nav.Item> within <Sidenav> instead.');
  }
  const {
    as = 'li',
    active: activeProp,
    classPrefix = 'dropdown-item',
    children,
    disabled,
    divider,
    panel,
    className,
    style,
    icon,
    eventKey,
    onClick,
    onSelect,
    ...rest
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const selected = activeProp !== null && activeProp !== void 0 ? activeProp : !isNil(eventKey) && (shallowEqual(eventKey, sidenav.activeKey) || shallowEqual(nav.activeKey, eventKey));
  const classes = merge(className, withPrefix());
  const dataAttributes = {
    'data-active': selected,
    'data-disabled': disabled,
    'data-with-icon': !!icon
  };
  const handleClick = useCallback(event => {
    var _nav$onSelect, _sidenav$onSelect;
    if (disabled) return;
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    (_nav$onSelect = nav.onSelect) === null || _nav$onSelect === void 0 || _nav$onSelect.call(nav, eventKey, event);
    (_sidenav$onSelect = sidenav.onSelect) === null || _sidenav$onSelect === void 0 || _sidenav$onSelect.call(sidenav, eventKey, event);
  }, [disabled, onSelect, sidenav, eventKey, nav]);
  const menuitemEventHandlers = {
    onClick: createChainedFunction(handleClick, onClick)
  };
  const renderDropdownItem = useRenderMenuItem(as);
  if (divider) {
    return renderDropdownItem({
      ref,
      role: 'separator',
      style,
      className: merge(prefix('divider'), className),
      ...rest
    });
  }
  if (panel) {
    return renderDropdownItem({
      ref,
      role: 'none presentation',
      style,
      className: merge(prefix('panel'), className),
      ...rest,
      children
    });
  }
  return renderDropdownItem({
    ref,
    ...rest,
    style,
    className: classes,
    'aria-current': selected || undefined,
    ...dataAttributes,
    ...menuitemEventHandlers,
    children: /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.cloneElement(icon, {
      className: merge(prefix('menu-icon'), icon.props.className)
    }), children, /*#__PURE__*/React.createElement(Ripple, null))
  }, SafeAnchor);
});
ExpandedSidenavDropdownItem.displayName = 'Sidenav.Dropdown.Item';
export default ExpandedSidenavDropdownItem;