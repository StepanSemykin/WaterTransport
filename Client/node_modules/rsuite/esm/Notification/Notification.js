'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState } from 'react';
import useDelayedClosure from "../toaster/hooks/useDelayedClosure.js";
import CloseButton from "../internals/CloseButton/index.js";
import Box from "../internals/Box/index.js";
import { MESSAGE_STATUS_ICONS } from "../internals/constants/statusIcons.js";
import { useStyles, useCustom, useIsMounted, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs } from "../internals/utils/index.js";
/**
 * The `Notification` component is used to display global messages and notifications.
 *
 * @see https://rsuitejs.com/components/notification
 */
const Notification = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Notification', props);
  const {
    as,
    classPrefix = 'notification',
    closable,
    duration = 4500,
    className,
    type,
    header,
    children,
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
  const targetRef = React.useRef(null);

  // Timed close message
  const {
    clear
  } = useDelayedClosure({
    targetRef,
    onClose,
    duration
  });

  // Click to trigger to close the message
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
  const classes = merge(className, withPrefix(type, {
    closable
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "alert"
  }, rest, {
    ref: mergeRefs(targetRef, ref),
    className: classes
  }), type && /*#__PURE__*/React.createElement("div", {
    className: prefix`icon`
  }, MESSAGE_STATUS_ICONS[type]), /*#__PURE__*/React.createElement("div", {
    className: prefix`content`
  }, header && /*#__PURE__*/React.createElement("div", {
    className: prefix('header')
  }, header), /*#__PURE__*/React.createElement("div", {
    className: prefix('description')
  }, typeof children === 'function' ? children() : children)), closable && /*#__PURE__*/React.createElement(CloseButton, {
    onClick: handleClose
  }));
});
Notification.displayName = 'Notification';
export default Notification;