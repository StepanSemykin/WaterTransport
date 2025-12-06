'use client';
import React from 'react';
import { PROGRESS_STATUS_ICON } from "../internals/constants/statusIcons.js";
import { useStyles } from "../internals/hooks/index.js";
/**
 * Shared component for displaying progress information
 * Used by both ProgressLine and ProgressCircle
 */
const ProgressInfo = props => {
  const {
    percent,
    renderInfo,
    status,
    classPrefix
  } = props;
  const {
    prefix
  } = useStyles(classPrefix);
  const showIcon = status && status !== 'active';
  return /*#__PURE__*/React.createElement("div", {
    className: prefix('info')
  }, renderInfo ? renderInfo(percent, status) : showIcon ? PROGRESS_STATUS_ICON[status] : `${percent}%`);
};
export default ProgressInfo;