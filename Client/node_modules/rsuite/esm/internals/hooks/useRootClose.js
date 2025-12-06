'use client';
import { useEffect, useCallback } from 'react';
import contains from 'dom-lib/contains';
import ownerDocument from 'dom-lib/ownerDocument';
import on from 'dom-lib/on';
import { getDOMNode } from "../utils/index.js";
import { KEY_VALUES } from "../constants/index.js";
function isLeftClickEvent(event) {
  return (event === null || event === void 0 ? void 0 : event.button) === 0;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event !== null && event !== void 0 && event.shiftKey);
}
/**
 * A hook that listens to the document click event and closes the overlay.
 * @param onRootClose
 * @param param1
 * @todo Allow different behaviors based on whether clicked element is focusable
 */
export function useRootClose(onRootClose, {
  disabled,
  triggerTarget,
  overlayTarget,
  listenEscape = true
}) {
  const handleDocumentKeyUp = useCallback(event => {
    if (listenEscape && event.key === KEY_VALUES.ESC) {
      onRootClose === null || onRootClose === void 0 || onRootClose(event);
    }
  }, [listenEscape, onRootClose]);
  const handleDocumentMouseDown = useCallback(event => {
    const triggerElement = getDOMNode(triggerTarget);
    const overlayElement = getDOMNode(overlayTarget);

    // Check if the clicked element is a trigger.
    if (triggerElement && contains(triggerElement, event.target)) {
      return;
    }

    // Check if the clicked element is a overlay.
    if (overlayElement && contains(overlayElement, event.target)) {
      return;
    }
    if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
      return;
    }
    onRootClose === null || onRootClose === void 0 || onRootClose(event);
  }, [onRootClose, triggerTarget, overlayTarget]);
  useEffect(() => {
    const currentTarget = getDOMNode(triggerTarget);
    if (disabled || !currentTarget) return;
    const doc = ownerDocument(currentTarget);
    const onDocumentMouseDownListener = on(doc, 'mousedown', handleDocumentMouseDown, true);
    const onDocumentKeyupListener = on(doc, 'keyup', handleDocumentKeyUp);
    return () => {
      onDocumentMouseDownListener === null || onDocumentMouseDownListener === void 0 || onDocumentMouseDownListener.off();
      onDocumentKeyupListener === null || onDocumentKeyupListener === void 0 || onDocumentKeyupListener.off();
    };
  }, [triggerTarget, disabled, onRootClose, handleDocumentMouseDown, handleDocumentKeyUp]);
}
export default useRootClose;