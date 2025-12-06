'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useRef } from 'react';
import CloseButton from "../internals/CloseButton/index.js";
import useDelayedClosure from "../toaster/hooks/useDelayedClosure.js";
import Box from "../internals/Box/index.js";
import { mergeRefs, forwardRef } from "../internals/utils/index.js";
import { MESSAGE_STATUS_ICONS } from "../internals/constants/statusIcons.js";
import { useStyles, useCustom, useIsMounted, useEventCallback } from "../internals/hooks/index.js";
/**
 * The `Message` component is used to display important messages to users.
 * @see https://rsuitejs.com/components/message
 */
const Message = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Message', props);
  const {
    as = 'div',
    bordered,
    centered,
    className,
    classPrefix = 'message',
    children,
    closable,
    duration = 2000,
    full,
    header,
    type = 'info',
    showIcon,
    onClose,
    ...rest
  } = propsWithDefaults;
  const [display, setDisplay] = useState('show');
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const isMounted = useIsMounted();
  const targetRef = useRef(null);

  // Timed close message
  const {
    clear
  } = useDelayedClosure({
    targetRef,
    onClose,
    duration
  });
  const handleClose = useEventCallback(event => {
    setDisplay('hiding');
    onClose === null || onClose === void 0 || onClose(event);
    clear();
    setTimeout(() => {
      if (isMounted()) {
        setDisplay('hide');
      }
    }, 1000);
  });
  if (display === 'hide') {
    return null;
  }
  const classes = merge(className, withPrefix(type, display, {
    full,
    bordered,
    centered,
    ['has-title']: header,
    ['has-icon']: showIcon
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "alert"
  }, rest, {
    ref: mergeRefs(targetRef, ref),
    className: classes
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix`container`
  }, showIcon && /*#__PURE__*/React.createElement("div", {
    className: prefix`icon`
  }, MESSAGE_STATUS_ICONS[type]), /*#__PURE__*/React.createElement("div", {
    className: prefix`content`
  }, header && /*#__PURE__*/React.createElement("div", {
    className: prefix`header`
  }, header), children && /*#__PURE__*/React.createElement("div", {
    className: prefix`body`
  }, children)), closable && /*#__PURE__*/React.createElement(CloseButton, {
    onClick: handleClose
  })));
});
Message.displayName = 'Message';
export default Message;