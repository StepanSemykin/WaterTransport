'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ScrollView from "../../internals/ScrollView/index.js";
const TimeColumn = props => {
  const {
    prefix,
    title,
    children,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement("div", {
    className: prefix('column')
  }, /*#__PURE__*/React.createElement("div", {
    className: prefix('column-title')
  }, title), /*#__PURE__*/React.createElement(ScrollView, _extends({
    customScrollbar: true,
    as: "ul",
    role: "listbox"
  }, rest), children));
};
export default TimeColumn;