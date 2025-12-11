'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
export const PanelGroupContext = /*#__PURE__*/React.createContext({});

/**
 * The `PanelGroup` component is used to display content that can be collapsed.
 * @see https://rsuitejs.com/components/panel
 */
const PanelGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PanelGroup', props);
  const {
    as,
    accordion,
    defaultActiveKey,
    bordered,
    className,
    classPrefix = 'panel-group',
    children,
    activeKey: activeProp,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const [activeKey, setActiveKey] = useControlled(activeProp, defaultActiveKey);
  const classes = merge(className, withPrefix({
    accordion,
    bordered
  }));
  const handleSelect = useEventCallback((activeKey, event) => {
    setActiveKey(activeKey);
    onSelect === null || onSelect === void 0 || onSelect(activeKey, event);
  });
  const contextValue = useMemo(() => ({
    accordion,
    activeKey,
    onGroupSelect: handleSelect
  }), [accordion, activeKey, handleSelect]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement(PanelGroupContext.Provider, {
    value: contextValue
  }, children));
});
PanelGroup.displayName = 'PanelGroup';
export default PanelGroup;