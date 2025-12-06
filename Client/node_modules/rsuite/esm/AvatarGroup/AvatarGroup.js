'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef, getCssValue, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
export const AvatarGroupContext = /*#__PURE__*/React.createContext({});

/**
 * The AvatarGroup component is used to represent a collection of avatars.
 * @see https://rsuitejs.com/components/avatar
 */
const AvatarGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('AvatarGroup', props);
  const {
    as,
    classPrefix = 'avatar-group',
    spacing,
    className,
    children,
    stack,
    size,
    style,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    cssVar
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    stack
  }));
  const contextValue = useMemo(() => ({
    size
  }), [size]);
  const styles = mergeStyles(style, cssVar('spacing', spacing, getCssValue));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "group"
  }, rest, {
    ref: ref,
    className: classes,
    style: styles
  }), /*#__PURE__*/React.createElement(AvatarGroupContext.Provider, {
    value: contextValue
  }, children));
});
AvatarGroup.displayName = 'AvatarGroup';
export default AvatarGroup;