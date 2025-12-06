'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useEffect } from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { ContainerContext } from "../Container/Container.js";
/**
 * The `Sidebar` component for use with the `Container` component.
 * @see https://rsuitejs.com/components/container/
 */
const Sidebar = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Sidebar', props);
  const {
    as = 'aside',
    classPrefix = 'sidebar',
    className,
    collapsible,
    width = 260,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    collapse: collapsible
  }));
  const {
    setHasSidebar
  } = useContext(ContainerContext);
  useEffect(() => {
    /** Notify the Container that the Sidebar is in the child node of the Container. */
    setHasSidebar === null || setHasSidebar === void 0 || setHasSidebar(true);
  }, [setHasSidebar]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    w: width,
    ref: ref,
    className: classes
  }, rest));
});
Sidebar.displayName = 'Sidebar';
export default Sidebar;