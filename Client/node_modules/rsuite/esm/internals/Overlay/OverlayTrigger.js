'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useEffect, useImperativeHandle, useCallback, useState, useMemo, isValidElement, cloneElement } from 'react';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import isUndefined from 'lodash/isUndefined';
import contains from 'dom-lib/contains';
import Overlay from "./Overlay.js";
import { useOverlay } from "./OverlayProvider.js";
import { usePortal, useControlled } from "../hooks/index.js";
import { createChainedFunction, isOneOf } from "../utils/index.js";
import { isFragment } from "../utils/index.js";
function mergeEvents(events = {}, props = {}) {
  const nextEvents = {};
  Object.keys(events).forEach(eventName => {
    if (events[eventName]) {
      nextEvents[eventName] = createChainedFunction(events[eventName], props === null || props === void 0 ? void 0 : props[eventName]);
    }
  });
  return nextEvents;
}
/**
 * The reason that triggers closing of an overlay
 * - Clicking outside of the overlay
 * - Direct invocation of triggerRef.current.close()
 */
export let OverlayCloseCause = /*#__PURE__*/function (OverlayCloseCause) {
  OverlayCloseCause[OverlayCloseCause["ClickOutside"] = 0] = "ClickOutside";
  OverlayCloseCause[OverlayCloseCause["ImperativeHandle"] = 1] = "ImperativeHandle";
  return OverlayCloseCause;
}({});

/**
 * Useful for mouseover and mouseout.
 * In order to resolve the node entering the mouseover element, a mouseout event and a mouseover event will be triggered.
 * https://javascript.info/mousemove-mouseover-mouseout-mouseenter-mouseleave
 * @param handler
 * @param event
 */
function onMouseEventHandler(handler, event, relatedNative) {
  const target = event.currentTarget;
  const related = event.relatedTarget || get(event, ['nativeEvent', relatedNative]);
  if ((!related || related !== target) && !contains(target, related)) {
    handler(event);
  }
}
const defaultTrigger = ['hover', 'focus'];

/**
 * OverlayTrigger is used to display floating elements on another component.
 * @private
 */
const OverlayTrigger = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    overlayContainer
  } = useOverlay();
  const {
    children,
    container = overlayContainer,
    controlId,
    defaultOpen,
    trigger = defaultTrigger,
    disabled,
    followCursor,
    readOnly,
    plaintext,
    open: openProp,
    delay,
    delayOpen: delayOpenProp,
    delayClose: delayCloseProp,
    enterable,
    placement = 'bottomStart',
    speaker,
    rootClose = true,
    overlayAs: OverlayComponent,
    onClick,
    onMouseOver,
    onMouseMove,
    onMouseOut,
    onContextMenu,
    onFocus,
    onBlur,
    onOpen,
    onClose,
    onExited,
    ...rest
  } = props;
  const {
    Portal,
    target: containerElement
  } = usePortal({
    container
  });
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const [open, setOpen] = useControlled(openProp, defaultOpen);
  const [cursorPosition, setCursorPosition] = useState(null);

  // Delay the timer to close/open the overlay
  // When the cursor moves from the trigger to the overlay, the overlay will be closed.
  // In order to keep the overlay open, a timer is used to delay the closing.
  const delayOpenTimer = useRef(null);
  const delayCloseTimer = useRef(null);
  const delayOpen = isNil(delayOpenProp) ? delay : delayOpenProp;
  const delayClose = isNil(delayCloseProp) ? delay : delayCloseProp;

  // Whether the cursor is on the overlay
  const isOnOverlay = useRef(false);

  // Whether the cursor is on the trigger
  const isOnTrigger = useRef(false);
  useEffect(() => {
    return () => {
      if (!isNil(delayOpenTimer.current)) {
        clearTimeout(delayOpenTimer.current);
      }
      if (!isNil(delayCloseTimer.current)) {
        clearTimeout(delayCloseTimer.current);
      }
    };
  }, []);

  // Whether the cursor is on the overlay
  const mouseEnter = useRef(false);
  const handleOpenChange = useCallback((nextOpen, closeCause) => {
    // if the overlay open state is not changed, do not fire the event
    if (nextOpen === open) return;
    if (nextOpen) {
      onOpen === null || onOpen === void 0 || onOpen();
    } else {
      onClose === null || onClose === void 0 || onClose(closeCause);
    }
    setOpen(nextOpen);
  }, [open, onOpen, onClose, setOpen]);
  const handleOpen = useCallback(delay => {
    const ms = isUndefined(delay) ? delayOpen : delay;
    if (ms && typeof ms === 'number') {
      return delayOpenTimer.current = setTimeout(() => {
        delayOpenTimer.current = null;
        if (mouseEnter.current) {
          handleOpenChange(true);
        }
      }, ms);
    }
    handleOpenChange(true);
  }, [delayOpen, handleOpenChange]);
  const handleClose = useCallback((delay, closeCause) => {
    const ms = isUndefined(delay) ? delayClose : delay;
    if (ms && typeof ms === 'number') {
      return delayCloseTimer.current = setTimeout(() => {
        delayCloseTimer.current = null;
        handleOpenChange(false, closeCause);
      }, ms);
    }
    handleOpenChange(false, closeCause);
  }, [delayClose, handleOpenChange]);
  const handleExited = useCallback(() => {
    setCursorPosition(null);
  }, []);
  useImperativeHandle(ref, () => ({
    get root() {
      return triggerRef.current;
    },
    get overlay() {
      var _overlayRef$current;
      return (_overlayRef$current = overlayRef.current) === null || _overlayRef$current === void 0 ? void 0 : _overlayRef$current.child;
    },
    getState: () => ({
      open
    }),
    open: handleOpen,
    close: delay => handleClose(delay, OverlayCloseCause.ImperativeHandle),
    updatePosition: () => {
      var _overlayRef$current2, _overlayRef$current2$;
      (_overlayRef$current2 = overlayRef.current) === null || _overlayRef$current2 === void 0 || (_overlayRef$current2$ = _overlayRef$current2.updatePosition) === null || _overlayRef$current2$ === void 0 || _overlayRef$current2$.call(_overlayRef$current2);
    }
  }));

  /**
   * Close after the cursor leaves.
   */
  const handleCloseWhenLeave = useCallback(() => {
    // When the cursor is not on the overlay and not on the trigger, it is closed.
    if (!isOnOverlay.current && !isOnTrigger.current) {
      handleClose(undefined, OverlayCloseCause.ClickOutside);
    }
  }, [handleClose]);
  const handleDelayedOpen = useCallback(() => {
    mouseEnter.current = true;
    if (!enterable) {
      return handleOpen();
    }
    isOnTrigger.current = true;
    if (!isNil(delayCloseTimer.current)) {
      clearTimeout(delayCloseTimer.current);
      delayCloseTimer.current = null;
      return handleOpen();
    }
    if (open) {
      return;
    }
    handleOpen();
  }, [enterable, open, handleOpen]);

  /**
   * Toggle open and closed state.
   */
  const handleOpenState = useCallback(() => {
    if (open) {
      handleCloseWhenLeave();
    } else {
      handleDelayedOpen();
    }
  }, [open, handleCloseWhenLeave, handleDelayedOpen]);
  const handleDelayedClose = useCallback(() => {
    mouseEnter.current = false;
    if (!enterable) {
      return handleClose();
    }
    isOnTrigger.current = false;
    if (!isNil(delayOpenTimer.current)) {
      clearTimeout(delayOpenTimer.current);
      delayOpenTimer.current = null;
      return;
    }
    if (!open || !isNil(delayCloseTimer.current)) {
      return;
    }
    delayCloseTimer.current = setTimeout(() => {
      if (!isNil(delayCloseTimer.current)) {
        clearTimeout(delayCloseTimer.current);
        delayCloseTimer.current = null;
      }
      handleCloseWhenLeave();
    }, 200);
  }, [enterable, open, handleClose, handleCloseWhenLeave]);
  const handleSpeakerMouseEnter = useCallback(() => {
    isOnOverlay.current = true;
  }, []);
  const handleSpeakerMouseLeave = useCallback(() => {
    isOnOverlay.current = false;
    if (!isOneOf('click', trigger) && !isOneOf('contextMenu', trigger) && !isOneOf('active', trigger)) {
      handleCloseWhenLeave();
    }
  }, [handleCloseWhenLeave, trigger]);
  const handledMoveOverlay = useCallback(event => {
    setCursorPosition(() => ({
      top: event.pageY,
      left: event.pageX,
      clientTop: event.clientX,
      clientLeft: event.clientY
    }));
  }, []);
  const handleMouseOver = useCallback(event => {
    onMouseEventHandler(handleDelayedOpen, event, 'fromElement');
  }, [handleDelayedOpen]);
  const handleMouseOut = useCallback(event => {
    onMouseEventHandler(handleDelayedClose, event, 'toElement');
  }, [handleDelayedClose]);
  const preventDefault = useCallback(event => {
    event.preventDefault();
  }, []);
  const triggerEvents = useMemo(() => {
    // Pass events by props
    const events = {
      onClick,
      onContextMenu,
      onMouseOver,
      onMouseOut,
      onFocus,
      onBlur,
      onMouseMove
    };

    // When trigger is disabled, no predefined event listeners are added.
    if (disabled || readOnly || plaintext || trigger === 'none') {
      return events;
    }

    // Get the cursor position through onMouseMove.
    // https://rsuitejs.com/components/tooltip/#follow-cursor
    if (followCursor) {
      events.onMouseMove = createChainedFunction(handledMoveOverlay, onMouseMove);
    }

    // The `click` event is usually used in `toggle` scenarios.
    // The first click will open and the second click will close.
    if (isOneOf('click', trigger)) {
      events.onClick = createChainedFunction(handleOpenState, events.onClick);
      return events;
    }

    // The difference between it and the click event is that it does not trigger the close.
    if (isOneOf('active', trigger)) {
      events.onClick = createChainedFunction(handleDelayedOpen, events.onClick);
      return events;
    }
    if (isOneOf('hover', trigger)) {
      events.onMouseOver = createChainedFunction(handleMouseOver, events.onMouseOver);
      events.onMouseOut = createChainedFunction(handleMouseOut, events.onMouseOut);
    }
    if (isOneOf('focus', trigger)) {
      events.onFocus = createChainedFunction(handleDelayedOpen, events.onFocus);
      events.onBlur = createChainedFunction(handleDelayedClose, events.onBlur);
    }
    if (isOneOf('contextMenu', trigger)) {
      events.onContextMenu = createChainedFunction(preventDefault, handleOpenState, events.onContextMenu);
    }
    return events;
  }, [disabled, followCursor, handleDelayedClose, handleDelayedOpen, handleMouseOut, handleMouseOver, handleOpenState, handledMoveOverlay, onBlur, onClick, onContextMenu, onFocus, onMouseMove, onMouseOut, onMouseOver, plaintext, preventDefault, readOnly, trigger]);
  const renderOverlay = () => {
    const overlayProps = {
      ...rest,
      rootClose,
      triggerTarget: triggerRef,
      onClose: trigger !== 'none' ? () => handleClose(undefined, OverlayCloseCause.ClickOutside) : undefined,
      onExited: createChainedFunction(followCursor ? handleExited : undefined, onExited),
      placement,
      container: containerElement,
      open
    };
    const speakerProps = {
      id: controlId
    };

    // The purpose of adding mouse entry and exit events to the Overlay is to record whether the current cursor is on the Overlay.
    // When `trigger` is equal to `hover`, if the cursor leaves the `triggerTarget` and stays on the Overlay,
    // the Overlay will continue to remain open.
    if (trigger !== 'none' && enterable) {
      speakerProps.onMouseEnter = handleSpeakerMouseEnter;
      speakerProps.onMouseLeave = handleSpeakerMouseLeave;
    }
    return /*#__PURE__*/React.createElement(Overlay, _extends({}, overlayProps, {
      ref: overlayRef,
      childrenProps: speakerProps,
      followCursor: followCursor,
      cursorPosition: cursorPosition
    }), typeof speaker === 'function' ? (props, ref) => {
      return speaker({
        ...props,
        onClose: handleClose
      }, ref);
    } : speaker);
  };
  const triggerElement = useMemo(() => {
    if (typeof children === 'function') {
      return children(triggerEvents, triggerRef);
    } else if (isFragment(children) || ! /*#__PURE__*/isValidElement(children)) {
      return /*#__PURE__*/React.createElement("span", _extends({
        ref: triggerRef,
        "aria-describedby": controlId
      }, triggerEvents), children);
    }
    const childElement = children;
    return /*#__PURE__*/cloneElement(childElement, {
      ref: triggerRef,
      'aria-describedby': controlId,
      ...mergeEvents(triggerEvents, childElement.props)
    });
  }, [children, controlId, triggerEvents]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, triggerElement, OverlayComponent ? /*#__PURE__*/React.createElement(OverlayComponent, {
    open: open,
    onClose: handleClose,
    placement: "bottom",
    speaker: speaker
  }) : /*#__PURE__*/React.createElement(Portal, null, renderOverlay()));
});
OverlayTrigger.displayName = 'OverlayTrigger';
export default OverlayTrigger;