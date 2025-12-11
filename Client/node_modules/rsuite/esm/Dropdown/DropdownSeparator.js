'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * The `<Dropdown.Separator>` API
 *
 * Renders a non-focusable and non-interactive `separator`
 * Per ARIA APG https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 */
const DropdownSeparator = forwardRef((props, ref) => {
  const {
    classPrefix = 'dropdown-item-divider',
    className,
    as: Component = 'li',
    ...restProps
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref,
    role: "separator",
    className: merge(withPrefix(), className)
  }, restProps));
});
DropdownSeparator.displayName = 'Dropdown.Separator';
export default DropdownSeparator;