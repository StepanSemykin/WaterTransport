'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import useCombobox from "./hooks/useCombobox.js";
import { forwardRef } from "../utils/index.js";
import { useStyles, useEventCallback } from "../hooks/index.js";
const ListItem = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    role = 'option',
    classPrefix = 'dropdown-menu-item',
    active,
    children,
    className,
    disabled,
    focus,
    value,
    onKeyDown,
    onSelect,
    renderItem,
    ...rest
  } = props;
  const {
    id
  } = useCombobox();
  const handleClick = useEventCallback(event => {
    event.preventDefault();
    if (!disabled) {
      onSelect === null || onSelect === void 0 || onSelect(value, event);
    }
  });
  const {
    withPrefix,
    merge,
    rootPrefix
  } = useStyles(classPrefix);
  const classes = withPrefix({
    active,
    focus,
    disabled
  });
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: role,
    "aria-selected": active,
    "aria-disabled": disabled,
    id: id ? `${id}-opt-${value}` : undefined,
    "data-key": value
  }, rest, {
    ref: ref,
    className: merge(className, rootPrefix`picker-list-item`),
    tabIndex: -1,
    onKeyDown: disabled ? null : onKeyDown,
    onClick: handleClick
  }), /*#__PURE__*/React.createElement("span", {
    className: classes
  }, renderItem ? renderItem(value) : children));
});
ListItem.displayName = 'ListItem';
export default ListItem;