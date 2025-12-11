'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import InputGroup from "../../InputGroup/index.js";
const PickerLabel = ({
  children,
  className,
  as: Component = InputGroup.Addon,
  ...rest
}) => {
  return children ? /*#__PURE__*/React.createElement(Component, _extends({
    "data-testid": "picker-label",
    className: className
  }, rest), children) : null;
};
export default PickerLabel;