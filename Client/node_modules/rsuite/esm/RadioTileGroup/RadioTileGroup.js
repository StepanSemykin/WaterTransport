'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo } from 'react';
import Stack from "../Stack/index.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom, useControlled } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
export const RadioTileContext = /*#__PURE__*/React.createContext({});

/**
 * The `RadioTileGroup` component is used to group a collection of `RadioTile` components.
 * @version 5.35.0
 * @see https://rsuitejs.com/components/radio-tile/
 */
const RadioTileGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('RadioTileGroup', props);
  const {
    as = Stack,
    className,
    inline,
    children,
    classPrefix = 'radio-tile-group',
    disabled,
    value: valueProp,
    defaultValue,
    name,
    onChange,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const handleChange = useCallback((nextValue, event) => {
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
  }, [onChange, setValue]);
  const contextValue = useMemo(() => ({
    name,
    disabled,
    value: typeof value === 'undefined' ? null : value,
    onChange: handleChange
  }), [disabled, handleChange, name, value]);
  return /*#__PURE__*/React.createElement(RadioTileContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    alignItems: "stretch",
    spacing: 10,
    role: "radiogroup",
    direction: inline ? 'row' : 'column',
    ref: ref,
    className: classes
  }, rest), children));
});
RadioTileGroup.displayName = 'RadioTileGroup';
export default RadioTileGroup;