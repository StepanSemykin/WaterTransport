'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ModalTitle from "../Modal/ModalTitle.js";
import { forwardRef } from "../internals/utils/index.js";
const DrawerTitle = forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(ModalTitle, _extends({
    classPrefix: "drawer-title"
  }, props, {
    ref: ref
  }));
});
DrawerTitle.displayName = 'DrawerTitle';
export default DrawerTitle;