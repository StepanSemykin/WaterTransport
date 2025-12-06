'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Drawer from "../../Drawer/index.js";
const speakerRef = () => {
  // This is just a no-op callback to satisfy the type requirements
};
export const PickerDrawer = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    placement = 'bottom',
    speaker,
    onClose,
    open,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Drawer, _extends({
    placement: placement,
    onClose: onClose,
    open: open,
    ref: ref
  }, rest), typeof speaker === 'function' ? speaker({
    placement
  }, speakerRef) : speaker);
});
PickerDrawer.displayName = 'PickerDrawer';
export default PickerDrawer;