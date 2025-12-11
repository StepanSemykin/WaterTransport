'use client';
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
const IndentLine = () => {
  const {
    prefix
  } = useStyles('tree');
  return /*#__PURE__*/React.createElement("span", {
    className: prefix('indent-line'),
    "data-testid": "indent-line"
  });
};
export default IndentLine;