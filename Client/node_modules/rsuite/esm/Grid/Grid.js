'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The Grid component is used to specify the layout of child elements in rows and columns.
 * @see https://rsuitejs.com/components/grid
 */
const Grid = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Grid', props);
  const {
    as,
    classPrefix = 'grid-container',
    className,
    fluid,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, fluid ? prefix({
    fluid
  }) : withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes
  }));
});
Grid.displayName = 'Grid';
export default Grid;