'use client';
import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import MenuItem from "../internals/Menu/MenuItem.js";
import NavContext from "./NavContext.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, shallowEqual } from "../internals/utils/index.js";
import { useRenderMenuItem } from "../internals/Menu/useRenderMenuItem.js";
/**
 * @private
 */
const NavDropdownItem = forwardRef((props, ref) => {
  const nav = useContext(NavContext);
  if (!nav) {
    throw new Error('<Nav.Dropdown.Item> should be used within a <Nav> component.');
  }
  const {
    as = 'li',
    active: activeProp,
    classPrefix = 'dropdown-item',
    className,
    eventKey,
    icon,
    divider,
    panel,
    children,
    disabled,
    onSelect,
    ...restProps
  } = props;
  const {
    activeKey,
    onSelect: onSelectFromNav
  } = nav;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const selected = activeProp || !isNil(eventKey) && shallowEqual(activeKey, eventKey);
  const handleSelectItem = useCallback(event => {
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    onSelectFromNav === null || onSelectFromNav === void 0 || onSelectFromNav(eventKey, event);
  }, [onSelect, eventKey, onSelectFromNav]);
  const renderDropdownItem = useRenderMenuItem(as);
  if (divider) {
    return renderDropdownItem({
      ref,
      role: 'separator',
      className: merge(prefix('divider'), className),
      ...restProps
    });
  }
  if (panel) {
    return renderDropdownItem({
      ref,
      className: merge(prefix('panel'), className),
      children,
      ...restProps
    });
  }
  return /*#__PURE__*/React.createElement(MenuItem, {
    selected: selected,
    disabled: disabled,
    onActivate: handleSelectItem
  }, ({
    selected,
    active,
    ...menuitem
  }, menuitemRef) => {
    const classes = merge(className, withPrefix({
      divider,
      panel
    }));
    const dataAttributes = {
      'data-focus': active,
      'data-active': selected,
      'data-disabled': disabled,
      'data-with-icon': !!icon,
      'data-event-key': eventKey
    };
    if (!isNil(eventKey) && typeof eventKey !== 'string') {
      dataAttributes['data-event-key-type'] = typeof eventKey;
    }
    return renderDropdownItem({
      ref: mergeRefs(ref, menuitemRef),
      className: classes,
      ...menuitem,
      ...dataAttributes,
      ...restProps,
      children: /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.cloneElement(icon, {
        className: classNames(prefix('menu-icon'), icon.props.className)
      }), children)
    });
  });
});
NavDropdownItem.displayName = 'Nav.Dropdown.Item';
export default NavDropdownItem;