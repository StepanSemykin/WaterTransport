'use client';
import { useRef, useEffect, useCallback, useState } from 'react';
import PointerMoveTracker from 'dom-lib/PointerMoveTracker';
import addStyle from 'dom-lib/addStyle';
import getWidth from 'dom-lib/getWidth';
import { useEventCallback } from "../internals/hooks/index.js";
const useDrag = props => {
  const rootRef = useRef(null);
  const tooltipRef = useRef(null);
  const {
    tooltip,
    disabled,
    onDragMove,
    onDragEnd,
    onDragStart,
    keepTooltipOpen
  } = props;
  const [active, setActive] = useState(false);
  const moveTracker = useRef(null);

  // Release the move event
  const releaseMoves = useCallback(() => {
    var _moveTracker$current;
    (_moveTracker$current = moveTracker.current) === null || _moveTracker$current === void 0 || _moveTracker$current.releaseMoves();
    moveTracker.current = null;
  }, []);
  const setTooltipPosition = useCallback(() => {
    const tooltipElement = tooltipRef.current;
    if (tooltip && tooltipElement) {
      const width = getWidth(tooltipElement);

      // Set the position of the tooltip
      addStyle(tooltipElement, '--rs-tooltip-offset', `-${width / 2}px`);
    }
  }, [tooltip]);
  const handleDragMove = useEventCallback((_deltaX, _deltaY, event) => {
    var _moveTracker$current2;
    if ((_moveTracker$current2 = moveTracker.current) !== null && _moveTracker$current2 !== void 0 && _moveTracker$current2.isDragging()) {
      var _rootRef$current;
      onDragMove === null || onDragMove === void 0 || onDragMove(event, (_rootRef$current = rootRef.current) === null || _rootRef$current === void 0 ? void 0 : _rootRef$current.dataset);
      setTooltipPosition();
    }
  });
  const handleDragEnd = useEventCallback(event => {
    var _rootRef$current2;
    setActive(false);
    releaseMoves();
    onDragEnd === null || onDragEnd === void 0 || onDragEnd(event, (_rootRef$current2 = rootRef.current) === null || _rootRef$current2 === void 0 ? void 0 : _rootRef$current2.dataset);
  });
  const getMouseMoveTracker = useCallback(() => {
    return moveTracker.current || new PointerMoveTracker(document.body, {
      onMove: handleDragMove,
      onMoveEnd: handleDragEnd,
      useTouchEvent: true
    });
  }, [handleDragEnd, handleDragMove]);
  const onMoveStart = useEventCallback(event => {
    var _moveTracker$current3, _rootRef$current3;
    if (disabled) {
      return;
    }
    moveTracker.current = getMouseMoveTracker();
    (_moveTracker$current3 = moveTracker.current) === null || _moveTracker$current3 === void 0 || _moveTracker$current3.captureMoves(event);
    (_rootRef$current3 = rootRef.current) === null || _rootRef$current3 === void 0 || _rootRef$current3.focus();
    setActive(true);
    onDragStart === null || onDragStart === void 0 || onDragStart(event);
  });
  const onMouseEnter = useEventCallback(() => {
    setTooltipPosition();
  });
  useEffect(() => {
    if (keepTooltipOpen) {
      onMouseEnter();
    }
    return () => {
      releaseMoves();
    };
  }, [releaseMoves, keepTooltipOpen]);
  return {
    active,
    rootRef,
    tooltipRef,
    onMoveStart,
    onMouseEnter
  };
};
export default useDrag;