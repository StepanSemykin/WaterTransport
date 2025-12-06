'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import IconButton from "../IconButton/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { SidenavContext } from "./SidenavContext.js";
import { useStyles, useEventCallback } from "../internals/hooks/index.js";
const SidenavToggle = forwardRef((props, ref) => {
  const sidenav = useContext(SidenavContext);
  if (!sidenav) {
    console.error('<Sidenav.Toggle> must be rendered within a <Sidenav>');
    return null;
  }
  const {
    className,
    classPrefix = 'sidenav-toggle',
    onToggle,
    onClick,
    ...rest
  } = props;
  const expanded = sidenav.expanded;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    collapsed: !expanded
  }));
  const handleToggle = useEventCallback(event => {
    onToggle === null || onToggle === void 0 || onToggle(!expanded, event);
    onClick === null || onClick === void 0 || onClick(event);
  });
  return /*#__PURE__*/React.createElement(IconButton, _extends({
    ref: ref,
    className: classes,
    icon: /*#__PURE__*/React.createElement(ArrowLeftLineIcon, {
      "aria-label": ""
    }),
    onClick: handleToggle,
    "aria-label": expanded ? 'Collapse' : 'Expand'
  }, rest));
});
SidenavToggle.displayName = 'Sidenav.Toggle';
export default SidenavToggle;