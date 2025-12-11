'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ModalBody from "../Modal/ModalBody.js";
import { forwardRef } from "../internals/utils/index.js";
const DrawerBody = forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(ModalBody, _extends({
    classPrefix: "drawer-body"
  }, props, {
    ref: ref
  }));
});
DrawerBody.displayName = 'DrawerBody';
export default DrawerBody;