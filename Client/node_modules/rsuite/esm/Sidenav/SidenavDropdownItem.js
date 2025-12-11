'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import MenuItem from "../internals/Menu/MenuItem.js";
import isNil from 'lodash/isNil';
import NavContext from "../Nav/NavContext.js";
import ExpandedSidenavDropdownItem from "./ExpandedSidenavDropdownItem.js";
import { forwardRef, mergeRefs, shallowEqual } from "../internals/utils/index.js";
import { SidenavContext } from "./SidenavContext.js";
import { useStyles } from "../internals/hooks/index.js";
import { useRenderMenuItem } from "../internals/Menu/useRenderMenuItem.js";
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Item> within a <Sidenav>
 *
 * <Sidenav>
 *   <Nav>
 *     <Nav.Menu>
 *       <Nav.Item></Nav.Item> -> This will render <SidenavDropdownItem> component
 *     </Nav.Menu>
 *   </Nav>
 * </Sidenav>
 */
const SidenavDropdownItem = forwardRef((props, ref) => {
  const sidenav = useContext(SidenavContext);
  const nav = useContext(NavContext);
  if (!sidenav || !nav) {
    throw new Error('<Sidenav.Dropdown.Item> must be used within a <Nav> within a <Sidenav> component.');
  }
  const {
    as = 'li',
    active: activeProp,
    classPrefix = 'dropdown-item',
    className,
    children,
    divider,
    disabled,
    eventKey,
    icon,
    panel,
    onSelect,
    ...restProps
  } = props;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const handleSelectItem = useCallback(event => {
    var _nav$onSelect;
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    (_nav$onSelect = nav.onSelect) === null || _nav$onSelect === void 0 || _nav$onSelect.call(nav, eventKey, event);
  }, [onSelect, eventKey, nav]);
  const selected = activeProp || !isNil(eventKey) && shallowEqual(nav === null || nav === void 0 ? void 0 : nav.activeKey, eventKey);
  const renderDropdownItem = useRenderMenuItem(as);
  if (sidenav.expanded) {
    return /*#__PURE__*/React.createElement(ExpandedSidenavDropdownItem, _extends({
      ref: ref
    }, props));
  }
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
      'data-active': selected,
      'data-disabled': disabled,
      'data-focus': active,
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
SidenavDropdownItem.displayName = 'Sidenav.Dropdown.Item';
export default SidenavDropdownItem;