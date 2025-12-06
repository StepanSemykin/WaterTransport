'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ModalHeader from "../Modal/ModalHeader.js";
import { forwardRef } from "../internals/utils/index.js";
const DrawerHeader = forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(ModalHeader, _extends({
    classPrefix: "drawer-header"
  }, props, {
    ref: ref
  }));
});
DrawerHeader.displayName = 'DrawerHeader';
export default DrawerHeader;