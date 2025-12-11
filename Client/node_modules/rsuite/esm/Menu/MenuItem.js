'use client';
import React, { useCallback, useContext, cloneElement } from 'react';
import classNames from 'classnames';
import MenuItemBase from "../internals/Menu/MenuItem.js";
import MenuContext from "./MenuContext.js";
import isNil from 'lodash/isNil';
import Text from "../Text/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, shallowEqual } from "../internals/utils/index.js";
import { useRenderMenuItem } from "../internals/Menu/useRenderMenuItem.js";
const MenuItem = forwardRef((props, ref) => {
  const {
    as = 'li',
    active: activeProp,
    classPrefix = 'menu-item',
    className,
    description,
    shortcut,
    eventKey,
    icon,
    children,
    disabled,
    onSelect,
    ...rest
  } = props;
  const menu = useContext(MenuContext);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const handleSelectItem = useCallback(event => {
    var _menu$onSelect;
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    menu === null || menu === void 0 || (_menu$onSelect = menu.onSelect) === null || _menu$onSelect === void 0 || _menu$onSelect.call(menu, eventKey, event);
  }, [onSelect, eventKey, menu]);
  const selected = activeProp || !isNil(eventKey) && shallowEqual(menu === null || menu === void 0 ? void 0 : menu.activeKey, eventKey);
  const renderMenuItem = useRenderMenuItem(as);
  return /*#__PURE__*/React.createElement(MenuItemBase, {
    selected: selected,
    disabled: disabled,
    onActivate: handleSelectItem
  }, ({
    selected,
    active,
    ...menuitem
  }, menuitemRef) => {
    const classes = merge(className, withPrefix());
    const dataAttributes = {
      'data-active': selected,
      'data-disabled': disabled,
      'data-focus': active
    };
    return renderMenuItem({
      ref: mergeRefs(ref, menuitemRef),
      className: classes,
      ...dataAttributes,
      ...menuitem,
      ...rest,
      children: /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/cloneElement(icon, {
        className: classNames(prefix('menu-icon'), icon.props.className)
      }), /*#__PURE__*/React.createElement("div", {
        className: prefix('content')
      }, /*#__PURE__*/React.createElement(Text, {
        as: "span"
      }, children), /*#__PURE__*/React.createElement(Text, {
        as: "span",
        muted: true
      }, description)), shortcut && /*#__PURE__*/React.createElement(Text, {
        as: "kbd",
        className: prefix('shortcut'),
        muted: true
      }, shortcut))
    });
  });
});
MenuItem.displayName = 'MenuItem';
export default MenuItem;