'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, getCssValue, mergeStyles } from "../internals/utils/index.js";
/**
 * The `Placeholder.Grid` component is used to display the loading state of the block.
 * @see https://rsuitejs.com/components/placeholder
 */
const PlaceholderGrid = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PlaceholderGrid', props);
  const {
    as,
    className,
    classPrefix = 'placeholder',
    rows = 5,
    columns = 5,
    rowHeight,
    rowSpacing,
    active,
    style,
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    prefix,
    cssVar,
    withPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix('grid'));
  const styles = mergeStyles(style, cssVar('row-height', rowHeight, getCssValue), cssVar('row-spacing', rowSpacing, getCssValue));
  const items = useMemo(() => {
    const colItems = [];
    const rowClassName = prefix`row`;
    const columnClassName = prefix`grid-col`;
    for (let i = 0; i < columns; i++) {
      const rowItems = [];
      for (let j = 0; j < rows; j++) {
        rowItems.push(/*#__PURE__*/React.createElement("div", {
          key: j,
          className: rowClassName
        }));
      }
      colItems.push(/*#__PURE__*/React.createElement("div", {
        key: i,
        className: columnClassName
      }, rowItems));
    }
    return colItems;
  }, [columns, prefix, rowHeight, rowSpacing, rows]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles,
    "data-active": active
  }, rest), items);
});
PlaceholderGrid.displayName = 'PlaceholderGrid';
export default PlaceholderGrid;