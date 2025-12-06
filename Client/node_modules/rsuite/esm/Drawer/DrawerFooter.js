'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ModalFooter from "../Modal/ModalFooter.js";
import { forwardRef } from "../internals/utils/index.js";
const DrawerFooter = forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(ModalFooter, _extends({
    classPrefix: "drawer-footer"
  }, props, {
    ref: ref
  }));
});
DrawerFooter.displayName = 'DrawerFooter';
export default DrawerFooter;