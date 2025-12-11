'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ProgressStroke from "./ProgressStroke.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * A component to render multiple sections in a progress bar
 */
const ProgressSections = /*#__PURE__*/React.memo(props => {
  const {
    classPrefix,
    sections,
    vertical,
    ...rest
  } = props;
  const {
    prefix
  } = useStyles(classPrefix);
  let countPercent = 0;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: prefix('sections')
  }, rest), sections.map((section, index) => {
    const sectionStroke = /*#__PURE__*/React.createElement(ProgressStroke, {
      key: index,
      classPrefix: classPrefix,
      percent: section.percent,
      color: section.color,
      vertical: vertical,
      isSection: true,
      tooltip: section.tooltip,
      countPercent: countPercent
    }, section.label);
    countPercent += section.percent;
    return sectionStroke;
  }));
});
ProgressSections.displayName = 'ProgressSections';
export default ProgressSections;