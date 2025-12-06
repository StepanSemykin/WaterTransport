'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import OverlayTrigger from "../internals/Overlay/OverlayTrigger.js";
import { createChainedFunction, placementPolyfill } from "../internals/utils/index.js";
import { useCustom } from "../internals/hooks/index.js";
/**
 * The `Whisper` component is used to display a floating element.
 * It is usually used with the `Tooltip` and `Popover` components.
 *
 * @see https://rsuitejs.com/components/whisper
 */
const Whisper = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    propsWithDefaults,
    rtl
  } = useCustom('Whisper', props);
  const {
    onOpen,
    onClose,
    onEntered,
    onExited,
    placement = 'right',
    preventOverflow,
    ...rest
  } = propsWithDefaults;
  return /*#__PURE__*/React.createElement(OverlayTrigger, _extends({}, rest, {
    ref: ref,
    preventOverflow: preventOverflow,
    placement: placementPolyfill(placement, rtl),
    onEntered: createChainedFunction(onOpen, onEntered),
    onExited: createChainedFunction(onClose, onExited)
  }));
});
Whisper.displayName = 'Whisper';
export default Whisper;