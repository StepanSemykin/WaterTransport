'use client';
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
/**
 * A component to render multiple sections in a circular progress bar
 */
const ProgressCircleSections = /*#__PURE__*/React.memo(props => {
  const {
    classPrefix,
    sections,
    pathString,
    strokeLinecap,
    strokeWidth,
    gapDegree,
    totalPercent
  } = props;
  const {
    prefix
  } = useStyles(classPrefix);
  let startPercent = 0;
  return /*#__PURE__*/React.createElement(React.Fragment, null, sections.map((section, index) => {
    const sectionLen = Math.PI * 2 * (50 - strokeWidth / 2);
    const gapLength = gapDegree / 360 * sectionLen;
    const sectionPercent = section.percent;
    const endPercent = startPercent + sectionPercent;

    // Calculate the stroke dash array and offset for this section
    const sectionStyle = {
      stroke: section.color,
      strokeDasharray: `${sectionPercent / 100 * (sectionLen - gapLength)}px ${sectionLen}px`,
      strokeDashoffset: `-${gapLength / 2 + startPercent / 100 * (sectionLen - gapLength)}px`
    };
    const sectionPath = /*#__PURE__*/React.createElement("path", {
      key: index,
      d: pathString,
      strokeLinecap: strokeLinecap,
      className: prefix('stroke'),
      strokeWidth: totalPercent === 0 ? 0 : strokeWidth,
      fillOpacity: "0",
      style: sectionStyle
    });
    startPercent = endPercent;
    return sectionPath;
  }));
});
ProgressCircleSections.displayName = 'ProgressCircleSections';
export default ProgressCircleSections;