'use client';
import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import DisclosureContext, { DisclosureActionTypes } from "../internals/Disclosure/DisclosureContext.js";
import NavContext from "../Nav/NavContext.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, createChainedFunction, shallowEqual } from "../internals/utils/index.js";
import { NavbarContext } from "./NavbarContext.js";
import { useRenderMenuItem } from "../internals/Menu/useRenderMenuItem.js";
/**
 * @private
 */
const NavbarDropdownItem = forwardRef((props, ref) => {
  const navbar = useContext(NavbarContext);
  const nav = useContext(NavContext);
  if (!navbar || !nav) {
    throw new Error('<Navbar.Dropdown.Item> must be rendered within a <Nav> component within a <Navbar> component.');
  }
  const {
    as = 'li',
    active: activeProp,
    classPrefix = 'dropdown-item',
    className,
    children,
    disabled,
    divider,
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
  const disclosure = useContext(DisclosureContext);
  const [, dispatchDisclosure] = disclosure !== null && disclosure !== void 0 ? disclosure : [];
  const handleClickNavbarDropdownItem = useCallback(event => {
    dispatchDisclosure === null || dispatchDisclosure === void 0 || dispatchDisclosure({
      type: DisclosureActionTypes.Hide,
      cascade: true
    });
    handleSelectItem === null || handleSelectItem === void 0 || handleSelectItem(event);
  }, [dispatchDisclosure, handleSelectItem]);
  const selected = activeProp || !isNil(eventKey) && shallowEqual(nav.activeKey, eventKey);
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
  const classes = merge(className, withPrefix({
    divider,
    panel
  }));
  const dataAttributes = {
    'data-active': selected,
    'data-with-icon': !!icon,
    'data-disabled': disabled,
    'data-event-key': eventKey
  };
  if (!isNil(eventKey) && typeof eventKey !== 'string') {
    dataAttributes['data-event-key-type'] = typeof eventKey;
  }
  return renderDropdownItem({
    ref,
    className: classes,
    'aria-current': selected || undefined,
    ...dataAttributes,
    ...restProps,
    onClick: createChainedFunction(handleClickNavbarDropdownItem, restProps.onClick),
    children: /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.cloneElement(icon, {
      className: classNames(prefix('menu-icon'), icon.props.className)
    }), children)
  });
});
NavbarDropdownItem.displayName = 'Navbar.Dropdown.Item';
export default NavbarDropdownItem;