'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import SafeAnchor from "../internals/SafeAnchor/index.js";
import ExternalLinkIcon from "./ExternalLinkIcon.js";
const Link = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Link', props);
  const {
    as,
    anchorIcon,
    classPrefix = 'link',
    className,
    children,
    disabled,
    underline,
    showAnchorIcon,
    external,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const icon = anchorIcon || /*#__PURE__*/React.createElement(ExternalLinkIcon, {
    className: prefix('icon')
  });
  return /*#__PURE__*/React.createElement(SafeAnchor, _extends({
    as: as,
    ref: ref,
    role: "link",
    className: classes,
    disabled: disabled,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener noreferrer' : undefined,
    "data-underline": underline,
    "data-disabled": disabled
  }, rest), children, showAnchorIcon && icon);
});
Link.displayName = 'Link';
export default Link;