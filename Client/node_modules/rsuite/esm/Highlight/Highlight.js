'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef, stringifyReactNode } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { highlightText } from "./utils/highlightText.js";
function defaultRenderMark(match, index) {
  return /*#__PURE__*/React.createElement("mark", {
    key: index,
    className: "rs-highlight-mark"
  }, match);
}

/**
 *
 * Highlight the matching text in the content.
 *
 * @see https://rsuitejs.com/components/highlight
 */
const Highlight = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Highlight', props);
  const {
    as,
    classPrefix = 'highlight',
    className,
    children,
    query,
    renderMark = defaultRenderMark,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const text = stringifyReactNode(children);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), highlightText(text, {
    query,
    renderMark
  }));
});
Highlight.displayName = 'Highlight';
export default Highlight;