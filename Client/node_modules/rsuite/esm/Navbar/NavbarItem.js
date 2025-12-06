'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import NavContext from "../Nav/NavContext.js";
import SafeAnchor from "../internals/SafeAnchor/index.js";
import Ripple from "../internals/Ripple/index.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, shallowEqual } from "../internals/utils/index.js";
/**
 * @private
 */
const NavbarItem = forwardRef((props, ref) => {
  const {
    as = SafeAnchor,
    active: activeProp,
    disabled,
    eventKey,
    className,
    classPrefix = 'navbar-item',
    style,
    children,
    icon,
    onClick,
    onSelect: onSelectProp,
    ...rest
  } = props;
  const {
    activeKey,
    onSelect: onSelectFromNav
  } = useContext(NavContext);
  const active = activeProp !== null && activeProp !== void 0 ? activeProp : !isNil(eventKey) && shallowEqual(eventKey, activeKey);
  const emitSelect = useCallback(event => {
    onSelectProp === null || onSelectProp === void 0 || onSelectProp(eventKey, event);
    onSelectFromNav === null || onSelectFromNav === void 0 || onSelectFromNav(eventKey, event);
  }, [eventKey, onSelectProp, onSelectFromNav]);
  const {
    prefix,
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const handleClick = useCallback(event => {
    if (!disabled) {
      emitSelect(event);
      onClick === null || onClick === void 0 || onClick(event);
    }
  }, [disabled, emitSelect, onClick]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    "aria-selected": active || undefined,
    "data-active": active,
    "data-disabled": disabled
  }, rest, {
    className: classes,
    onClick: handleClick,
    style: style
  }), icon && /*#__PURE__*/React.cloneElement(icon, {
    className: classNames(prefix('icon'), icon.props.className)
  }), children, /*#__PURE__*/React.createElement(Ripple, null));
});
NavbarItem.displayName = 'Navbar.Item';
export default NavbarItem;