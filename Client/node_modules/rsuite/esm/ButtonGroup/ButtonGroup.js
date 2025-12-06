'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import ButtonGroupContext from "./ButtonGroupContext.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The ButtonGroup component is used to group a series of buttons together in a single line or column.
 * @see https://rsuitejs.com/components/button/#button-group
 */
const ButtonGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('ButtonGroup', props);
  const {
    as,
    classPrefix = 'btn-group',
    role = 'group',
    className,
    children,
    disabled,
    divided,
    block,
    vertical,
    justified,
    size,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const contextValue = useMemo(() => ({
    size,
    disabled
  }), [disabled, size]);
  return /*#__PURE__*/React.createElement(ButtonGroupContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    role: role,
    ref: ref,
    className: classes,
    "data-size": size,
    "data-block": block,
    "data-vertical": vertical,
    "data-justified": justified,
    "data-divided": divided
  }), children));
});
ButtonGroup.displayName = 'ButtonGroup';
export default ButtonGroup;