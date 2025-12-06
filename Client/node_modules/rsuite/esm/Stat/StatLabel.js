'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import InfoOutlineIcon from '@rsuite/icons/InfoOutline';
import Whisper from "../Whisper/index.js";
import Tooltip from "../Tooltip/index.js";
import IconButton from "../IconButton/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
const StatLabel = forwardRef((props, ref) => {
  const {
    as = 'dt',
    classPrefix = 'stat-label',
    className,
    children,
    info,
    uppercase,
    ...rest
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    uppercase
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), children, info && /*#__PURE__*/React.createElement(Whisper, {
    placement: "top",
    trigger: 'click',
    enterable: true,
    speaker: /*#__PURE__*/React.createElement(Tooltip, null, info)
  }, /*#__PURE__*/React.createElement(IconButton, {
    circle: true,
    size: "xs",
    appearance: "subtle",
    icon: /*#__PURE__*/React.createElement(InfoOutlineIcon, null)
  })));
});
StatLabel.displayName = 'StatLabel';
export default StatLabel;