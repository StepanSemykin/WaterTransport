'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
const svgProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '1.5',
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};
const ArrowUp = props => {
  return /*#__PURE__*/React.createElement("svg", _extends({}, svgProps, props), /*#__PURE__*/React.createElement("path", {
    d: "M17 7l-10 10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 7l9 0l0 9"
  }));
};
const ArrowDown = props => {
  return /*#__PURE__*/React.createElement("svg", _extends({}, svgProps, props), /*#__PURE__*/React.createElement("path", {
    d: "M7 7l10 10"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M17 8l0 9l-9 0"
  }));
};
const ArrowEqual = props => {
  return /*#__PURE__*/React.createElement("svg", _extends({}, svgProps, props), /*#__PURE__*/React.createElement("path", {
    d: "M7 9l10 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7 15l10 0"
  }));
};
const StatTrend = forwardRef((props, ref) => {
  const {
    as = 'span',
    appearance = 'default',
    classPrefix = 'stat-trend',
    indicator = 'up',
    className,
    children,
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix(appearance, indicator));
  const IndicatorIcon = indicator === 'up' ? ArrowUp : indicator === 'down' ? ArrowDown : ArrowEqual;
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), children, /*#__PURE__*/React.createElement(IndicatorIcon, {
    className: prefix('indicator')
  }));
});
StatTrend.displayName = 'StatTrend';
export default StatTrend;