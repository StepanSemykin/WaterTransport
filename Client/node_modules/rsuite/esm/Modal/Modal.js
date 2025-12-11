'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useMemo, useState, useCallback } from 'react';
import pick from 'lodash/pick';
import on from 'dom-lib/on';
import getAnimationEnd from 'dom-lib/getAnimationEnd';
import BaseModal from "../internals/Overlay/Modal.js";
import Bounce from "../Animation/Bounce.js";
import ModalDialog from "./ModalDialog.js";
import ModalBody from "./ModalBody.js";
import ModalHeader from "./ModalHeader.js";
import ModalTitle from "./ModalTitle.js";
import ModalFooter from "./ModalFooter.js";
import { useStyles, useCustom, useWillUnmount, useUniqueId } from "../internals/hooks/index.js";
import { mergeRefs, forwardRef } from "../internals/utils/index.js";
import { ModalContext } from "./ModalContext.js";
import { useBodyStyles } from "./utils.js";
const modalSizes = ['xs', 'sm', 'md', 'lg', 'full'];
const Subcomponents = {
  Body: ModalBody,
  Header: ModalHeader,
  Title: ModalTitle,
  Footer: ModalFooter,
  Dialog: ModalDialog
};

/**
 * The `Modal` component is used to show content in a layer above the app.
 * @see https://rsuitejs.com/components/modal
 */
const Modal = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Modal', props);
  const {
    animation = Bounce,
    animationProps,
    animationTimeout = 300,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    backdropClassName,
    backdrop = true,
    bodyFill,
    className,
    classPrefix = 'modal',
    centered,
    dialogClassName,
    dialogStyle,
    dialogAs: Dialog = ModalDialog,
    enforceFocus: enforceFocusProp,
    full,
    overflow = true,
    open,
    onClose,
    onEntered,
    onEntering,
    onExited,
    role = 'dialog',
    size = 'sm',
    id: idProp,
    isDrawer = false,
    closeButton,
    ...rest
  } = propsWithDefaults;
  const inClass = {
    in: open && !animation
  };
  const {
    merge,
    prefix
  } = useStyles(classPrefix);
  const [shake, setShake] = useState(false);
  const classes = merge(className, prefix({
    full,
    fill: bodyFill,
    [size]: modalSizes.includes(size)
  }));
  const dialogRef = useRef(null);
  const transitionEndListener = useRef(null);

  // The style of the Modal body will be updated with the size of the window or container.
  const [bodyStyles, onChangeBodyStyles, onDestroyEvents] = useBodyStyles(dialogRef, {
    overflow,
    prefix,
    size
  });
  const dialogId = useUniqueId('dialog-', idProp);
  const modalContextValue = useMemo(() => ({
    dialogId,
    onModalClose: onClose,
    getBodyStyles: () => bodyStyles,
    closeButton,
    isDrawer
  }), [dialogId, onClose, closeButton, isDrawer, bodyStyles]);
  const handleExited = useCallback(node => {
    var _transitionEndListene;
    onExited === null || onExited === void 0 || onExited(node);
    onDestroyEvents();
    (_transitionEndListene = transitionEndListener.current) === null || _transitionEndListene === void 0 || _transitionEndListene.off();
    transitionEndListener.current = null;
  }, [onDestroyEvents, onExited]);
  const handleEntered = useCallback(node => {
    onEntered === null || onEntered === void 0 || onEntered(node);
    onChangeBodyStyles();
  }, [onChangeBodyStyles, onEntered]);
  const handleEntering = useCallback(node => {
    onEntering === null || onEntering === void 0 || onEntering(node);
    onChangeBodyStyles(true);
  }, [onChangeBodyStyles, onEntering]);
  const backdropClick = useRef(null);
  const handleMouseDown = useCallback(event => {
    backdropClick.current = event.target === event.currentTarget;
  }, []);
  const handleBackdropClick = useCallback(event => {
    // Ignore click events from non-backdrop.
    // fix: https://github.com/rsuite/rsuite/issues/3394
    if (!backdropClick.current) {
      return;
    }

    // Ignore click events from dialog.
    if (event.target === dialogRef.current) {
      return;
    }

    // Ignore click events from dialog children.
    if (event.target !== event.currentTarget) {
      return;
    }

    // When the value of `backdrop` is `static`, a jitter animation will be added to the dialog when clicked.
    if (backdrop === 'static') {
      setShake(true);
      if (!transitionEndListener.current && dialogRef.current) {
        //fix: https://github.com/rsuite/rsuite/blob/a93d13c14fb20cc58204babe3331d3c3da3fe1fd/src/Modal/styles/index.less#L59
        transitionEndListener.current = on(dialogRef.current, getAnimationEnd(), () => {
          setShake(false);
        });
      }
      return;
    }
    onClose === null || onClose === void 0 || onClose(event);
  }, [backdrop, onClose]);
  useWillUnmount(() => {
    var _transitionEndListene2;
    (_transitionEndListene2 = transitionEndListener.current) === null || _transitionEndListene2 === void 0 || _transitionEndListene2.off();
  });
  let sizeKey = 'width';
  if (isDrawer) {
    const {
      placement
    } = animationProps || {};
    // The width or height of the drawer depends on the placement.
    sizeKey = placement === 'top' || placement === 'bottom' ? 'height' : 'width';
  }
  const enforceFocus = useMemo(() => {
    if (typeof enforceFocusProp === 'boolean') {
      return enforceFocusProp;
    }

    // When the Drawer is displayed and the backdrop is not displayed, the focus is not restricted.
    if (isDrawer && backdrop === false) {
      return false;
    }
  }, [backdrop, enforceFocusProp, isDrawer]);
  const wrapperClassName = merge(prefix`wrapper`, {
    [prefix`centered`]: centered,
    [prefix`no-backdrop`]: backdrop === false
  });
  return /*#__PURE__*/React.createElement(ModalContext.Provider, {
    value: modalContextValue
  }, /*#__PURE__*/React.createElement(BaseModal, _extends({
    "data-testid": isDrawer ? 'drawer-wrapper' : 'modal-wrapper'
  }, rest, {
    ref: ref,
    backdrop: backdrop,
    enforceFocus: enforceFocus,
    open: open,
    onClose: onClose,
    className: wrapperClassName,
    onEntered: handleEntered,
    onEntering: handleEntering,
    onExited: handleExited,
    backdropClassName: merge(prefix`backdrop`, backdropClassName, inClass),
    containerClassName: prefix({
      open,
      'has-backdrop': backdrop
    }),
    transition: animation ? animation : undefined,
    animationProps: animationProps,
    dialogTransitionTimeout: animationTimeout,
    backdropTransitionTimeout: 150,
    onClick: backdrop ? handleBackdropClick : undefined,
    onMouseDown: handleMouseDown
  }), (transitionProps, transitionRef) => {
    const {
      className: transitionClassName,
      ...transitionRest
    } = transitionProps;
    return /*#__PURE__*/React.createElement(Dialog, _extends({
      role: role,
      id: dialogId,
      "aria-labelledby": ariaLabelledby !== null && ariaLabelledby !== void 0 ? ariaLabelledby : `${dialogId}-title`,
      "aria-describedby": ariaDescribedby !== null && ariaDescribedby !== void 0 ? ariaDescribedby : `${dialogId}-description`,
      style: {
        [sizeKey]: modalSizes.includes(size) ? undefined : size
      }
    }, transitionRest, pick(rest, ['size', 'className', 'classPrefix', 'dialogClassName', 'style', 'dialogStyle', 'children']), {
      ref: mergeRefs(dialogRef, transitionRef),
      classPrefix: classPrefix,
      className: merge(classes, transitionClassName, prefix({
        shake
      })),
      dialogClassName: dialogClassName,
      dialogStyle: dialogStyle
    }));
  }));
}, Subcomponents);
Modal.displayName = 'Modal';
export default Modal;