'use client';
import React, { useState, useEffect, useRef, useMemo, useCallback, useImperativeHandle } from 'react';
import getContainer from 'dom-lib/getContainer';
import ownerDocument from 'dom-lib/ownerDocument';
import on from 'dom-lib/on';
import addStyle from 'dom-lib/addStyle';
import isElement from "../../DOMHelper/isElement.js";
import { calcPosition } from "./utils/position.js";
import { ResizeObserver } from '@juggle/resize-observer';
import { getDOMNode, kebabPlace } from "../utils/index.js";
import { useUpdateEffect } from "../hooks/index.js";
const CSS_POSITION_X = '--rs-position-x';
const CSS_POSITION_Y = '--rs-position-y';
export const getPositionStyle = (x, y) => {
  return {
    [CSS_POSITION_X]: x !== undefined ? `${x}px` : undefined,
    [CSS_POSITION_Y]: y !== undefined ? `${y}px` : undefined
  };
};
const usePosition = (props, ref) => {
  const {
    placement = 'right',
    preventOverflow = false,
    containerPadding = 0,
    container,
    triggerTarget,
    followCursor,
    cursorPosition
  } = props;
  const containerRef = useRef(null);
  const lastTargetRef = useRef(null);
  const overlayResizeObserver = useRef(null);
  const defaultPosition = {
    placement,
    positionLeft: 0,
    positionTop: 0,
    arrowOffsetLeft: undefined,
    arrowOffsetTop: undefined
  };
  const [position, setPosition] = useState(defaultPosition);
  const utils = useMemo(() => calcPosition({
    placement,
    preventOverflow,
    padding: containerPadding
  }), [placement, preventOverflow, containerPadding]);
  const updatePosition = useCallback(
  /**
   * @param placementChanged  Whether the placement has changed
   * @param forceUpdateDOM Whether to update the DOM directly
   * @returns void
   */
  (placementChanged = true, forceUpdateDOM) => {
    if (!(triggerTarget !== null && triggerTarget !== void 0 && triggerTarget.current)) {
      return;
    }
    const targetElement = getDOMNode(triggerTarget);
    if (!isElement(targetElement)) {
      throw new Error('`target` should return an HTMLElement');
    }

    //  If the target and placement do not change, the position is not updated.
    if (targetElement === lastTargetRef.current && !placementChanged) {
      return;
    }
    const overlay = getDOMNode(ref.current);
    const containerElement = getContainer(typeof container === 'function' ? container() : container !== null && container !== void 0 ? container : null, ownerDocument(ref.current).body);
    const posi = utils.calcOverlayPosition(overlay, targetElement, containerElement, followCursor ? cursorPosition : undefined);
    if (forceUpdateDOM && overlay) {
      addStyle(overlay, getPositionStyle(posi.positionLeft, posi.positionTop));
      if (posi.placement) {
        overlay.dataset.placement = kebabPlace(posi.placement);
      }
    } else {
      setPosition(posi);
    }
    containerRef.current = containerElement;
    lastTargetRef.current = targetElement;
  }, [container, ref, triggerTarget, utils, followCursor, cursorPosition]);
  useEffect(() => {
    updatePosition(false);
    const overlay = getDOMNode(ref.current);
    let containerScrollListener;
    if (containerRef.current && preventOverflow) {
      var _containerRef$current;
      // Update the overlay position when the container scroll bar is scrolling
      containerScrollListener = on(((_containerRef$current = containerRef.current) === null || _containerRef$current === void 0 ? void 0 : _containerRef$current.tagName) === 'BODY' ? window : containerRef.current, 'scroll', () => updatePosition(true, true));
    }

    // Update the position when the window size changes
    const resizeListener = on(window, 'resize', () => updatePosition(true, true));
    if (overlay) {
      // Update the position when the size of the overlay changes
      overlayResizeObserver.current = new ResizeObserver(() => updatePosition(true, true));
      overlayResizeObserver.current.observe(overlay);
    }
    return () => {
      var _containerScrollListe, _overlayResizeObserve;
      lastTargetRef.current = null;
      (_containerScrollListe = containerScrollListener) === null || _containerScrollListe === void 0 || _containerScrollListe.off();
      resizeListener === null || resizeListener === void 0 || resizeListener.off();
      (_overlayResizeObserve = overlayResizeObserver.current) === null || _overlayResizeObserve === void 0 || _overlayResizeObserve.disconnect();
    };
  }, [preventOverflow, ref, updatePosition]);
  useUpdateEffect(() => updatePosition(), [updatePosition, placement]);
  return [position, updatePosition];
};
/**
 * The `Position` component calculates the position of the child element.
 * @private
 */
const Position = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    children,
    followCursor,
    cursorPosition
  } = props;
  const childRef = React.useRef(null);
  const [position, updatePosition] = usePosition(props, childRef);
  const {
    arrowOffsetLeft,
    arrowOffsetTop,
    positionLeft,
    positionTop,
    placement
  } = position;
  useImperativeHandle(ref, () => ({
    get child() {
      return childRef.current;
    },
    updatePosition
  }));
  useEffect(() => {
    if (!followCursor || !cursorPosition) return;
    updatePosition();
  }, [followCursor, cursorPosition, updatePosition]);
  if (typeof children === 'function') {
    const childProps = {
      placement,
      arrowOffsetLeft,
      arrowOffsetTop,
      left: positionLeft,
      top: positionTop
    };
    return children(childProps, childRef);
  }
  return children;
});
Position.displayName = 'Position';
export default Position;