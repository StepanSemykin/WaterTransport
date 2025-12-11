'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
export const ContainerContext = /*#__PURE__*/React.createContext({});
/**
 * The Container component is used to wrap content in a themed container with a max-width.
 * @see https://rsuitejs.com/components/container
 */
const Container = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Container', props);
  const {
    as = 'section',
    classPrefix = 'container',
    className,
    children,
    ...rest
  } = propsWithDefaults;
  const [hasSidebar, setHasSidebar] = useState(false);
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    'has-sidebar': hasSidebar
  }));
  const contextValue = useMemo(() => ({
    setHasSidebar
  }), [setHasSidebar]);
  return /*#__PURE__*/React.createElement(ContainerContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }), children));
});
Container.displayName = 'Container';
export default Container;