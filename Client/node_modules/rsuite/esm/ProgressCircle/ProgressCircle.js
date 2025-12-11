'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import ProgressInfo from "../Progress/ProgressInfo.js";
import ProgressCircleSections from "./ProgressCircleSections.js";
import useProgressCirclePath from "./hooks/useProgressCirclePath.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * Display circular progress for an operation.
 * @see https://rsuitejs.com/components/progress-circle
 */
const ProgressCircle = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('ProgressCircle', props);
  const {
    as,
    classPrefix = 'progress-circle',
    className,
    gapDegree = 0,
    gapPosition = 'top',
    percent = 0,
    renderInfo,
    showInfo = true,
    status,
    strokeColor,
    strokeLinecap = 'round',
    strokeWidth = 6,
    style,
    trailColor,
    trailWidth = strokeWidth,
    width,
    sections,
    ...rest
  } = propsWithDefaults;

  // Calculate total percent from sections if provided
  const totalPercent = useMemo(() => {
    if (!sections) return percent;
    return Math.min(100, sections.reduce((acc, section) => acc + section.percent, 0));
  }, [percent, sections]);
  const {
    pathString,
    trailPathStyle,
    strokePathStyle
  } = useProgressCirclePath({
    gapDegree,
    gapPosition,
    totalPercent,
    strokeColor,
    strokeWidth,
    trailColor
  });
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    [`${status || ''}`]: !!status
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "progressbar",
    "aria-valuemin": "0",
    "aria-valuemax": "100",
    "aria-valuenow": totalPercent,
    ref: ref,
    className: classes,
    style: style
  }, rest), showInfo && /*#__PURE__*/React.createElement(ProgressInfo, {
    percent: totalPercent,
    renderInfo: renderInfo,
    status: status,
    classPrefix: classPrefix
  }), /*#__PURE__*/React.createElement("svg", {
    className: prefix('svg'),
    viewBox: "0 0 100 100",
    width: width
  }, /*#__PURE__*/React.createElement("path", {
    className: prefix('trail'),
    d: pathString,
    strokeWidth: trailWidth || strokeWidth,
    fillOpacity: "0",
    style: trailPathStyle
  }), sections ? /*#__PURE__*/React.createElement(ProgressCircleSections, {
    classPrefix: classPrefix,
    sections: sections,
    pathString: pathString,
    strokeLinecap: strokeLinecap,
    strokeWidth: strokeWidth,
    gapDegree: gapDegree,
    totalPercent: totalPercent
  }) :
  /*#__PURE__*/
  // Render single stroke
  React.createElement("path", {
    d: pathString,
    strokeLinecap: strokeLinecap,
    className: prefix('stroke'),
    strokeWidth: totalPercent === 0 ? 0 : strokeWidth,
    fillOpacity: "0",
    style: strokePathStyle
  })));
});
ProgressCircle.displayName = 'ProgressCircle';
export default ProgressCircle;