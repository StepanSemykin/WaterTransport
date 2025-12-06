'use client';
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
const Indicator = ({
  style,
  classPrefix
}) => {
  const {
    prefix
  } = useStyles(classPrefix);
  return /*#__PURE__*/React.createElement("div", {
    className: prefix('indicator'),
    style: style
  });
};
Indicator.displayName = 'Indicator';
export default Indicator;