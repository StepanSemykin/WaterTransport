'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import classNames from 'classnames';
import Collapse from "../Animation/Collapse.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { mergeRefs } from "../internals/utils/index.js";
const SidenavDropdownCollapse = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    as = 'ul',
    className,
    classPrefix = 'dropdown-menu',
    open,
    ...restProps
  } = props;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Collapse, {
    in: open,
    exitedClassName: prefix`collapse-out`,
    exitingClassName: prefix`collapsing`,
    enteredClassName: prefix`collapse-in`,
    enteringClassName: prefix`collapsing`
  }, (transitionProps, transitionRef) => {
    const {
      className: transitionClassName,
      ...transitionRestProps
    } = transitionProps;
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: mergeRefs(ref, transitionRef),
      role: "group",
      className: classNames(classes, transitionClassName)
    }, restProps, transitionRestProps));
  });
});
SidenavDropdownCollapse.displayName = 'Sidenav.Dropdown.Collapse';
export default SidenavDropdownCollapse;