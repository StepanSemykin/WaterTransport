'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useMemo } from 'react';
import BreadcrumbItem from "./BreadcrumbItem.js";
import StyledBox from "../internals/StyledBox/index.js";
import { useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, rch, createComponent } from "../internals/utils/index.js";
const Subcomponents = {
  Item: BreadcrumbItem
};
const Separator = createComponent({
  name: 'BreadcrumbSeparator',
  componentAs: 'span',
  'aria-hidden': true
});

/**
 * The Breadcrumb component is used to indicate the current page location and navigate.
 * @see https://rsuitejs.com/components/breadcrumb
 */
const Breadcrumb = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Breadcrumb', props);
  const {
    as = 'nav',
    className,
    classPrefix = 'breadcrumb',
    children,
    ellipsis = '...',
    maxItems = 5,
    separator = '/',
    size,
    locale,
    onExpand,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const [showEllipsis, setShowEllipsis] = useState(true);
  const handleClickEllipsis = useEventCallback(event => {
    setShowEllipsis(false);
    onExpand === null || onExpand === void 0 || onExpand(event);
  });
  const content = useMemo(() => {
    const count = rch.count(children);
    const items = rch.mapCloneElement(children, (item, index) => {
      const isLast = index === count - 1;
      return {
        ...item.props,
        separator: isLast ? null : /*#__PURE__*/React.createElement(Separator, null, separator)
      };
    });
    if (count > maxItems && count > 2 && showEllipsis) {
      return [...items.slice(0, 1), [/*#__PURE__*/React.createElement(BreadcrumbItem, {
        role: "button",
        key: "ellipsis",
        title: locale === null || locale === void 0 ? void 0 : locale.expandText,
        "aria-label": locale === null || locale === void 0 ? void 0 : locale.expandText,
        separator: /*#__PURE__*/React.createElement(Separator, null, separator),
        onClick: handleClickEllipsis
      }, /*#__PURE__*/React.createElement("span", {
        "aria-hidden": true
      }, ellipsis))], ...items.slice(items.length - 1, items.length)];
    }
    return items;
  }, [children, ellipsis, handleClickEllipsis, locale === null || locale === void 0 ? void 0 : locale.expandText, maxItems, separator, showEllipsis]);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(StyledBox, _extends({
    name: "breadcrumb",
    as: as,
    size: size
  }, rest, {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement("ol", null, content));
}, Subcomponents);
Breadcrumb.displayName = 'Breadcrumb';
export default Breadcrumb;