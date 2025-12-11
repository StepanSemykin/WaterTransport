'use client';
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
import { mergeStyles } from "../internals/utils/index.js";
import Tooltip from "../Tooltip/index.js";
import Whisper from "../Whisper/index.js";
/**
 * A single stroke component used within ProgressLine
 */
const ProgressStroke = /*#__PURE__*/React.memo(props => {
  const {
    classPrefix,
    percent,
    color,
    vertical,
    children,
    isSection,
    tooltip,
    style,
    countPercent
  } = props;
  const {
    prefix
  } = useStyles(classPrefix);

  // Build class names
  const classes = prefix('stroke', {
    section: isSection
  });
  const content = /*#__PURE__*/React.createElement("div", {
    className: classes,
    style: mergeStyles(style, {
      width: vertical ? '100%' : `${percent}%`,
      height: vertical ? `${percent}%` : '100%',
      background: color,
      bottom: vertical ? `${countPercent}%` : undefined
    })
  }, children);
  return tooltip ? /*#__PURE__*/React.createElement(Whisper, {
    trigger: "hover",
    placement: "top",
    speaker: /*#__PURE__*/React.createElement(Tooltip, null, tooltip)
  }, content) : content;
});
ProgressStroke.displayName = 'ProgressStroke';
export default ProgressStroke;