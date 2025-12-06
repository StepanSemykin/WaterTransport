'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * The `<Menu.Separator>` API
 *
 */
const MenuSeparator = forwardRef((props, ref) => {
  const {
    as = 'li',
    classPrefix = 'menu-item-divider',
    className,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    role: "separator",
    className: merge(withPrefix(), className)
  }, rest));
});
MenuSeparator.displayName = 'MenuSeparator';
export default MenuSeparator;