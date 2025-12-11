'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import useCombobox from "../Picker/hooks/useCombobox.js";
import ScrollView from "../ScrollView/index.js";
import Box from "../Box/index.js";
import { useTreeContextProps } from "./TreeProvider.js";
import { forwardRef, mergeStyles, getCssValue } from "../utils/index.js";
const ScrollShadowView = forwardRef((props, ref) => {
  return /*#__PURE__*/React.createElement(ScrollView, _extends({
    scrollShadow: true,
    ref: ref
  }, props));
});
const TreeView = forwardRef((props, ref) => {
  const {
    as = 'div',
    children,
    treeRootClassName,
    multiselectable,
    style,
    height,
    ...rest
  } = props;
  const {
    scrollShadow,
    virtualized
  } = useTreeContextProps();
  const {
    id,
    labelId,
    popupType
  } = useCombobox();

  // If the tree is virtualized, the scroll shadow is not needed.
  const treeAs = scrollShadow && !virtualized ? ScrollShadowView : as;

  // If the tree is virtualized, the height is not needed.
  const viewStyles = mergeStyles(style, {
    '--rs-tree-view-height': virtualized ? undefined : getCssValue(height)
  });
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: treeAs,
    role: "tree",
    style: viewStyles,
    id: id ? `${id}-${popupType}` : undefined,
    "aria-multiselectable": multiselectable,
    "aria-labelledby": labelId,
    ref: ref
  }, rest), /*#__PURE__*/React.createElement("div", {
    className: treeRootClassName
  }, children));
});
TreeView.displayName = 'TreeView';
export default TreeView;