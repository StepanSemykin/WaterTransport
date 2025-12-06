'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useState, useEffect, useCallback } from 'react';
import getOffset from 'dom-lib/getOffset';
import on from 'dom-lib/on';
import Transition from "../../Animation/Transition.js";
import { useStyles, useCustom } from "../hooks/index.js";
import { mergeRefs, forwardRef } from "../utils/index.js";
const getPosition = (target, event) => {
  const offset = getOffset(target);
  const offsetX = (event.pageX || 0) - offset.left;
  const offsetY = (event.pageY || 0) - offset.top;
  const radiusX = Math.max(offset.width - offsetX, offsetX);
  const radiusY = Math.max(offset.height - offsetY, offsetY);
  const radius = Math.sqrt(Math.pow(radiusX, 2) + Math.pow(radiusY, 2));
  return {
    width: radius * 2,
    height: radius * 2,
    left: offsetX - radius,
    top: offsetY - radius
  };
};

/**
 * The `Ripple` component is used to implement the ripple effect.
 * @private
 */
const Ripple = forwardRef((props, ref) => {
  const {
    disableRipple
  } = useCustom();
  const {
    as: Component = 'span',
    className,
    classPrefix = 'ripple',
    onMouseDown,
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, prefix('pond'));
  const triggerRef = useRef(null);
  const [rippling, setRippling] = useState(false);
  const [position, setPosition] = useState();
  const handleRippled = () => {
    setRippling(false);
  };
  const handleMouseDown = useCallback(event => {
    if (triggerRef.current) {
      const position = getPosition(triggerRef.current, event);
      setRippling(true);
      setPosition(position);
      onMouseDown === null || onMouseDown === void 0 || onMouseDown(position, event);
    }
  }, [onMouseDown]);
  useEffect(() => {
    var _triggerRef$current;
    const parentNode = (_triggerRef$current = triggerRef.current) === null || _triggerRef$current === void 0 ? void 0 : _triggerRef$current.parentNode;
    if (parentNode) {
      const mousedownListener = on(parentNode, 'mousedown', handleMouseDown);
      return () => {
        mousedownListener === null || mousedownListener === void 0 || mousedownListener.off();
      };
    }
  }, [handleMouseDown]);
  if (disableRipple) {
    return null;
  }
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    className: classes,
    ref: mergeRefs(triggerRef, ref)
  }), /*#__PURE__*/React.createElement(Transition, {
    in: rippling,
    enteringClassName: prefix('rippling'),
    onEntered: handleRippled
  }, (props, ref) => {
    const {
      className,
      ...transitionRest
    } = props;
    return /*#__PURE__*/React.createElement("span", _extends({}, transitionRest, {
      ref: ref,
      className: merge(withPrefix(), className),
      style: position
    }));
  }));
});
Ripple.displayName = 'Ripple';
export default Ripple;