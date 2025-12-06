'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import Box from "../Box/index.js";
import { useCustom } from "../hooks/index.js";
import { forwardRef } from "../utils/index.js";
function isTrivialHref(href) {
  return !href || href.trim() === '#';
}

/**
 * A SafeAnchor is a wrapper around the `<a>` HTML element.
 * @private
 */
const SafeAnchor = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('SafeAnchor', props);
  const {
    as = 'a',
    href,
    disabled,
    onClick,
    ...restProps
  } = propsWithDefaults;
  const handleClick = useCallback(event => {
    if (disabled || isTrivialHref(href)) {
      event.preventDefault();
    }
    if (disabled) {
      event.stopPropagation();
      return;
    }
    onClick === null || onClick === void 0 || onClick(event);
  }, [disabled, href, onClick]);

  // There are default role and href attributes on the node to ensure Focus management and keyboard interactions.
  const trivialProps = isTrivialHref(href) ? {
    role: 'button',
    href: '#'
  } : null;
  if (disabled) {
    restProps.tabIndex = -1;
    restProps['aria-disabled'] = true;
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    href: href
  }, trivialProps, restProps, {
    onClick: handleClick
  }));
});
SafeAnchor.displayName = 'SafeAnchor';
export default SafeAnchor;