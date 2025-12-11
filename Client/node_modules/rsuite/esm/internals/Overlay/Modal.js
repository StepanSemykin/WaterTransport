'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useEffect, useState, useCallback } from 'react';
import classNames from 'classnames';
import contains from 'dom-lib/contains';
import on from 'dom-lib/on';
import ModalManager from "./ModalManager.js";
import Fade from "../../Animation/Fade.js";
import Box from "../Box/index.js";
import { OverlayProvider } from "./OverlayProvider.js";
import { KEY_VALUES } from "../constants/index.js";
import { usePortal, useWillUnmount, useEventCallback } from "../hooks/index.js";
import { forwardRef, mergeRefs, createChainedFunction } from "../utils/index.js";
let manager;
function getManager() {
  if (!manager) manager = new ModalManager();
  return manager;
}
const useModalManager = () => {
  const modalManager = getManager();
  const modal = useRef({
    dialog: null,
    backdrop: null
  });
  return {
    get dialog() {
      var _modal$current;
      return (_modal$current = modal.current) === null || _modal$current === void 0 ? void 0 : _modal$current.dialog;
    },
    add: (containerElement, containerClassName) => modalManager.add(modal.current, containerElement, containerClassName),
    remove: () => modalManager.remove(modal.current),
    isTopModal: () => modalManager.isTopModal(modal.current),
    setDialogRef: useCallback(ref => {
      modal.current.dialog = ref;
    }, []),
    setBackdropRef: useCallback(ref => {
      modal.current.backdrop = ref;
    }, [])
  };
};
const Modal = forwardRef((props, ref) => {
  const {
    as,
    children,
    transition: Transition,
    dialogTransitionTimeout,
    style,
    className,
    container,
    animationProps,
    containerClassName,
    keyboard = true,
    enforceFocus = true,
    backdrop = true,
    backdropTransitionTimeout,
    backdropStyle,
    backdropClassName,
    open,
    autoFocus = true,
    onEsc,
    onExit,
    onExiting,
    onExited,
    onEnter,
    onEntering,
    onEntered,
    onClose,
    onOpen,
    ...rest
  } = props;
  const [exited, setExited] = useState(!open);
  const {
    Portal,
    target: containerElement
  } = usePortal({
    container
  });
  const modal = useModalManager();
  if (open) {
    if (exited) setExited(false);
  } else if (!Transition && !exited) {
    setExited(true);
  }
  const mountModal = open || Transition && !exited;
  const lastFocus = useRef(null);
  const handleDocumentKeyDown = useEventCallback(event => {
    if (keyboard && event.key === KEY_VALUES.ESC && modal.isTopModal()) {
      onEsc === null || onEsc === void 0 || onEsc(event);
      onClose === null || onClose === void 0 || onClose(event);
    }
  });
  const restoreLastFocus = useCallback(() => {
    if (lastFocus.current) {
      var _lastFocus$current$fo, _lastFocus$current;
      (_lastFocus$current$fo = (_lastFocus$current = lastFocus.current).focus) === null || _lastFocus$current$fo === void 0 || _lastFocus$current$fo.call(_lastFocus$current);
      lastFocus.current = null;
    }
  }, []);

  /**
   * Determines if the currently focused element is inside the dialog,
   * and if not, returns the focus to the dialog.
   *
   */
  const handleFocusDialog = useEventCallback(onBeforeFocusCallback => {
    const currentActiveElement = document.activeElement;
    const dialog = modal.dialog;
    if (dialog && currentActiveElement && !contains(dialog, currentActiveElement)) {
      onBeforeFocusCallback === null || onBeforeFocusCallback === void 0 || onBeforeFocusCallback();
      dialog.focus();
    }
  });
  const handleEnforceFocus = useEventCallback(() => {
    if (!enforceFocus || !modal.isTopModal()) {
      return;
    }
    handleFocusDialog();
  });
  const documentKeyDownListener = useRef(null);
  const documentFocusListener = useRef(null);
  const handleOpen = useEventCallback(() => {
    if (containerElement) {
      modal.add(containerElement, containerClassName);
    }
    if (!documentKeyDownListener.current) {
      documentKeyDownListener.current = on(document, 'keydown', handleDocumentKeyDown);
    }
    if (!documentFocusListener.current) {
      documentFocusListener.current = on(document, 'focus', handleEnforceFocus, true);
    }
    if (autoFocus) {
      handleFocusDialog(() => {
        lastFocus.current = document.activeElement;
      });
    }
    onOpen === null || onOpen === void 0 || onOpen();
  });
  const handleClose = useEventCallback(() => {
    var _documentKeyDownListe, _documentFocusListene;
    modal.remove();
    (_documentKeyDownListe = documentKeyDownListener.current) === null || _documentKeyDownListe === void 0 || _documentKeyDownListe.off();
    documentKeyDownListener.current = null;
    (_documentFocusListene = documentFocusListener.current) === null || _documentFocusListene === void 0 || _documentFocusListene.off();
    documentFocusListener.current = null;
    restoreLastFocus();
  });
  useEffect(() => {
    if (!open) {
      return;
    }
    handleOpen();
  }, [open, handleOpen]);
  useEffect(() => {
    if (!exited) {
      return;
    }
    handleClose();
  }, [exited, handleClose]);
  useWillUnmount(() => {
    handleClose();
  });
  const handleExited = useCallback(() => {
    setExited(true);
  }, []);
  const overlayContainer = useCallback(() => {
    return modal.dialog;
  }, [modal.dialog]);
  if (!mountModal) {
    return null;
  }
  const renderBackdrop = () => {
    if (Transition) {
      return /*#__PURE__*/React.createElement(Fade, {
        transitionAppear: true,
        in: open,
        timeout: backdropTransitionTimeout
      }, (fadeProps, ref) => {
        const {
          className,
          ...rest
        } = fadeProps;
        return /*#__PURE__*/React.createElement("div", _extends({
          "aria-hidden": true,
          "data-testid": "backdrop"
        }, rest, {
          style: backdropStyle,
          ref: mergeRefs(modal.setBackdropRef, ref),
          className: classNames(backdropClassName, className)
        }));
      });
    }
    return /*#__PURE__*/React.createElement("div", {
      "aria-hidden": true,
      style: backdropStyle,
      className: backdropClassName
    });
  };
  const dialogElement = Transition ? /*#__PURE__*/React.createElement(Transition, _extends({}, animationProps, {
    transitionAppear: true,
    unmountOnExit: true,
    in: open,
    timeout: dialogTransitionTimeout,
    onExit: onExit,
    onExiting: onExiting,
    onExited: createChainedFunction(handleExited, onExited),
    onEnter: onEnter,
    onEntering: onEntering,
    onEntered: onEntered
  }), children) : children;
  return /*#__PURE__*/React.createElement(OverlayProvider, {
    overlayContainer: overlayContainer
  }, /*#__PURE__*/React.createElement(Portal, null, backdrop && renderBackdrop(), /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: mergeRefs(modal.setDialogRef, ref),
    style: style,
    className: className,
    tabIndex: -1
  }), dialogElement)));
});
Modal.displayName = 'OverlayModal';
export default Modal;