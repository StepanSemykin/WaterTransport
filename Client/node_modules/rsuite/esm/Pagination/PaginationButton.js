'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Button from "../Button/index.js";
import { useStyles, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
/**
 * PaginationButton component for pagination navigation.
 * Renders a button that can be used in pagination contexts.
 */
const PaginationButton = forwardRef((props, ref) => {
  const {
    as,
    active,
    disabled,
    className,
    classPrefix = 'pagination-btn',
    children,
    eventKey,
    onSelect,
    onClick,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const handleClick = useEventCallback(event => {
    if (disabled) {
      return;
    }
    onClick === null || onClick === void 0 || onClick(event);

    // Only call onSelect if the event hasn't been prevented
    if (!event.defaultPrevented && onSelect) {
      onSelect(eventKey, event);
    }
  });
  return /*#__PURE__*/React.createElement(Button, _extends({}, rest, {
    as: as,
    disabled: disabled,
    onClick: handleClick,
    ref: ref,
    className: classes,
    appearance: "subtle",
    "aria-disabled": disabled,
    "aria-current": active ? 'page' : undefined,
    active: active,
    "data-event-key": eventKey
  }), children);
});
PaginationButton.displayName = 'PaginationButton';
export default PaginationButton;