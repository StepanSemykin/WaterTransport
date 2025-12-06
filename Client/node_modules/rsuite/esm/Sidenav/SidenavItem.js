'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useCallback } from 'react';
import classNames from 'classnames';
import isNil from 'lodash/isNil';
import SafeAnchor from "../internals/SafeAnchor/index.js";
import NavContext from "../Nav/NavContext.js";
import MenuItem from "../internals/Menu/MenuItem.js";
import omit from 'lodash/omit';
import Whisper from "../Whisper/index.js";
import Tooltip from "../Tooltip/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef, shallowEqual, mergeRefs, createChainedFunction } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { SidenavContext } from "./SidenavContext.js";

/**
 * Props of SidenavItem component
 */

/**
 * @private
 */
const SidenavItem = forwardRef((props, ref) => {
  const sidenav = useContext(SidenavContext);
  if (!sidenav) {
    throw new Error('<SidenavItem> component is not supposed to be used standalone. Use <Nav.Item> inside <Sidenav> instead.');
  }
  const {
    as = SafeAnchor,
    active: activeProp,
    classPrefix = 'sidenav-item',
    children,
    className,
    disabled,
    divider,
    eventKey,
    icon,
    panel,
    style,
    tooltip = children,
    onClick,
    onSelect,
    ...rest
  } = props;
  const {
    activeKey,
    onSelect: onSelectFromNav
  } = useContext(NavContext);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const selected = activeProp !== null && activeProp !== void 0 ? activeProp : !isNil(eventKey) && shallowEqual(activeKey, eventKey);
  const whisperRef = React.useRef(null);
  const handleClick = useCallback(event => {
    var _whisperRef$current;
    if (disabled) return;
    (_whisperRef$current = whisperRef.current) === null || _whisperRef$current === void 0 || _whisperRef$current.close();
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    onSelectFromNav === null || onSelectFromNav === void 0 || onSelectFromNav(eventKey, event);
    onClick === null || onClick === void 0 || onClick(event);
  }, [disabled, onSelect, onSelectFromNav, eventKey, onClick]);
  const clonedIcon = icon ? /*#__PURE__*/React.cloneElement(icon, {
    className: classNames(prefix('icon'), icon.props.className)
  }) : null;
  const title = typeof children === 'string' ? /*#__PURE__*/React.createElement("span", {
    className: prefix('title')
  }, children) : children;
  if (!sidenav.expanded) {
    if (panel || divider) {
      return null;
    }
    return /*#__PURE__*/React.createElement(Whisper, {
      trigger: "hover",
      speaker: /*#__PURE__*/React.createElement(Tooltip, null, tooltip),
      placement: "right",
      ref: whisperRef
    }, (triggerProps, triggerRef) => /*#__PURE__*/React.createElement(MenuItem, {
      selected: selected,
      disabled: disabled,
      onActivate: handleClick
    }, ({
      selected,
      active,
      ...menuitem
    }, menuitemRef) => {
      const classes = merge(className, withPrefix());

      // Show tooltip when inside a collapse <Sidenav>
      return /*#__PURE__*/React.createElement(Box, _extends({
        as: as,
        ref: mergeRefs(mergeRefs(ref, menuitemRef), triggerRef),
        disabled: as === SafeAnchor ? disabled : undefined,
        className: classes,
        "data-active": selected,
        "data-disabled": disabled,
        "data-focus": active,
        "data-event-key": eventKey
      }, omit(rest, ['divider', 'panel']), triggerProps, menuitem, {
        onMouseOver: createChainedFunction(menuitem.onMouseOver, triggerProps.onMouseOver),
        onMouseOut: createChainedFunction(menuitem.onMouseOut, triggerProps.onMouseOut)
      }), clonedIcon, title);
    }));
  }
  if (divider) {
    return /*#__PURE__*/React.createElement("li", _extends({
      ref: ref,
      role: "separator",
      style: style,
      className: merge(className, prefix('divider'))
    }, rest));
  }
  if (panel) {
    return /*#__PURE__*/React.createElement("li", _extends({
      ref: ref,
      role: "none presentation",
      style: style,
      className: merge(className, prefix('panel'))
    }, rest), children);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: merge(className, withPrefix()),
    onClick: handleClick,
    style: style,
    "aria-selected": selected || undefined,
    "data-active": selected,
    "data-disabled": disabled,
    "data-event-key": eventKey
  }, rest), clonedIcon, title);
});
SidenavItem.displayName = 'Sidenav.Item';
export default SidenavItem;