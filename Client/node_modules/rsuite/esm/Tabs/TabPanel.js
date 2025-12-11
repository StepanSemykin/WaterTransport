'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles } from "../internals/hooks/index.js";
const TabPanel = forwardRef((props, ref) => {
  const {
    as,
    classPrefix = 'tab-panel',
    children,
    active,
    className,
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "tabpanel",
    ref: ref,
    tabIndex: 0,
    hidden: !active,
    className: merge(className, withPrefix())
  }, rest), children);
});
TabPanel.displayName = 'TabPanel';
export default TabPanel;