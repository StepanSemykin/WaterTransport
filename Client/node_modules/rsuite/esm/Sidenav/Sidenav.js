'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo, useCallback } from 'react';
import remove from 'lodash/remove';
import Transition from "../Animation/Transition.js";
import SidenavBody from "./SidenavBody.js";
import SidenavHeader from "./SidenavHeader.js";
import SidenavFooter from "./SidenavFooter.js";
import SidenavToggle from "./SidenavToggle.js";
import SidenavGroupLabel from "./SidenavGroupLabel.js";
import Box from "../internals/Box/index.js";
import { forwardRef, mergeRefs, shallowEqual } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled } from "../internals/hooks/index.js";
import { SidenavContext } from "./SidenavContext.js";
const emptyArray = [];
const Subcomponents = {
  Header: SidenavHeader,
  Body: SidenavBody,
  Footer: SidenavFooter,
  GroupLabel: SidenavGroupLabel,
  Toggle: SidenavToggle
};

/**
 * The `Sidenav` component is an encapsulation of the page sidebar `Nav`.
 * @see https://rsuitejs.com/components/sidenav/
 */
const Sidenav = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Sidenav', props);
  const {
    as = 'nav',
    className,
    classPrefix = 'sidenav',
    appearance = 'default',
    expanded = true,
    activeKey,
    defaultOpenKeys = emptyArray,
    openKeys: openKeysProp,
    onSelect,
    onOpenChange,
    ...rest
  } = propsWithDefaults;
  const [openKeys, setOpenKeys] = useControlled(openKeysProp, defaultOpenKeys);
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const handleOpenChange = useCallback((eventKey, event) => {
    const find = key => shallowEqual(key, eventKey);
    const nextOpenKeys = [...openKeys];
    if (nextOpenKeys.some(find)) {
      remove(nextOpenKeys, find);
    } else {
      nextOpenKeys.push(eventKey);
    }
    setOpenKeys(nextOpenKeys);
    onOpenChange === null || onOpenChange === void 0 || onOpenChange(nextOpenKeys, event);
  }, [onOpenChange, openKeys, setOpenKeys]);
  const contextValue = useMemo(() => ({
    expanded,
    activeKey,
    sidenav: true,
    openKeys: openKeys !== null && openKeys !== void 0 ? openKeys : [],
    onOpenChange: handleOpenChange,
    onSelect
  }), [activeKey, expanded, handleOpenChange, onSelect, openKeys]);
  return /*#__PURE__*/React.createElement(SidenavContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Transition, {
    in: expanded,
    timeout: 300,
    exitedClassName: prefix('collapse-out'),
    exitingClassName: prefix('collapse-out', 'collapsing'),
    enteredClassName: prefix('collapse-in'),
    enteringClassName: prefix('collapse-in', 'collapsing')
  }, (transitionProps, transitionRef) => {
    const {
      className,
      ...transitionRest
    } = transitionProps;
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as
    }, rest, transitionRest, {
      ref: mergeRefs(ref, transitionRef),
      className: merge(classes, className),
      "data-appearance": appearance
    }));
  }));
}, Subcomponents);
Sidenav.displayName = 'Sidenav';
export default Sidenav;