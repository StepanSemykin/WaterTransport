'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeStyles, getCssValue } from "../internals/utils/index.js";
/**
 * The `Placeholder.Paragraph` component is used to display the loading state of the block.
 * @see https://rsuitejs.com/components/placeholder
 */
const PlaceholderParagraph = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('PlaceholderParagraph', props);
  const {
    as,
    className,
    classPrefix = 'placeholder',
    rows = 3,
    rowHeight,
    rowSpacing,
    graph,
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
  const graphShape = graph === true ? 'square' : graph;
  const styles = mergeStyles(style, cssVar('row-height', rowHeight, getCssValue), cssVar('row-spacing', rowSpacing, getCssValue));
  const rowElements = useMemo(() => {
    const rowArr = [];
    for (let i = 0; i < rows; i++) {
      rowArr.push(/*#__PURE__*/React.createElement("div", {
        key: i,
        className: prefix`row`
      }));
    }
    return rowArr;
  }, [prefix, rows]);
  const classes = merge(className, withPrefix('paragraph'));
  const graphClasses = prefix('paragraph-graph');
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    style: styles,
    "data-active": active
  }, rest), graphShape && /*#__PURE__*/React.createElement("div", {
    className: graphClasses,
    "data-shape": graphShape
  }, /*#__PURE__*/React.createElement("span", {
    className: prefix('paragraph-graph-inner')
  })), /*#__PURE__*/React.createElement("div", {
    className: prefix('paragraph-group')
  }, rowElements));
});
PlaceholderParagraph.displayName = 'PlaceholderParagraph';
export default PlaceholderParagraph;