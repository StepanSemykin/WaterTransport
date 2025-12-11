'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { useStyles } from "../hooks/index.js";
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
const ListItemGroup = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    classPrefix = 'dropdown-menu-group',
    children,
    className,
    ...rest
  } = props;
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "group"
  }, rest, {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix`title`,
    tabIndex: -1
  }, /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement(ArrowDownIcon, {
    "aria-hidden": true,
    className: prefix`caret`
  })));
});
ListItemGroup.displayName = 'ListItemGroup';
export default ListItemGroup;