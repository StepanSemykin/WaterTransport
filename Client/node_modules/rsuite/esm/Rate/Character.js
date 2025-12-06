'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useMemo } from 'react';
import contains from 'dom-lib/contains';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { getStarStatus } from "./utils.js";
import { useStyles, useEventCallback } from "../internals/hooks/index.js";
const getKey = (element, target) => {
  return element && target && contains(element, target) ? 'before' : 'after';
};
const Character = forwardRef((props, ref) => {
  const {
    as = 'li',
    classPrefix = 'rate-character',
    className,
    children,
    vertical,
    status,
    disabled,
    onClick,
    onKeyDown,
    onMouseMove,
    ...rest
  } = props;
  const {
    prefix,
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const beforeRef = useRef(null);
  const handleMouseMove = useEventCallback(event => {
    onMouseMove === null || onMouseMove === void 0 || onMouseMove(getKey(beforeRef.current, event.target), event);
  });
  const handleClick = useEventCallback(event => {
    onClick === null || onClick === void 0 || onClick(getKey(beforeRef.current, event.target), event);
  });
  const eventHandlers = useMemo(() => {
    if (disabled) {
      return null;
    }
    return {
      onClick: handleClick,
      onKeyDown,
      onMouseMove: handleMouseMove
    };
  }, [disabled, handleClick, onKeyDown, handleMouseMove]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: merge(className, withPrefix()),
    tabIndex: disabled ? -1 : 0,
    "data-status": getStarStatus(status)
  }, eventHandlers, rest), /*#__PURE__*/React.createElement("div", {
    ref: beforeRef,
    className: prefix('before', {
      vertical
    })
  }, children), /*#__PURE__*/React.createElement("div", {
    className: prefix('after')
  }, children));
});
Character.displayName = 'Character';
export default Character;