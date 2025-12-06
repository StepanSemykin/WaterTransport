'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import useFlattenTree from "./hooks/useFlattenTree.js";
import useTreeWithChildren from "./hooks/useTreeWithChildren.js";
import useExpandTree from "./hooks/useExpandTree.js";
import TreeView from "./TreeView.js";
import { forwardRef } from "../internals/utils/index.js";
import { useControlled, useEventCallback, useCustom } from "../internals/hooks/index.js";
import { TreeProvider } from "../internals/Tree/TreeProvider.js";
/**
 * The `Tree` component is used to display hierarchical data.
 *
 * @see https://rsuitejs.com/components/tree
 */
const Tree = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Tree', props);
  const {
    value: controlledValue,
    defaultValue,
    childrenKey = 'children',
    labelKey = 'label',
    valueKey = 'value',
    data,
    defaultExpandAll = false,
    defaultExpandItemValues = [],
    expandItemValues: controlledExpandItemValues,
    virtualized,
    scrollShadow,
    renderTreeIcon,
    renderTreeNode,
    getChildren,
    onChange,
    onExpand,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const [value, setValue] = useControlled(controlledValue, defaultValue);
  const itemDataKeys = {
    childrenKey,
    labelKey,
    valueKey
  };
  const {
    treeData,
    loadingNodeValues,
    appendChild
  } = useTreeWithChildren(data, itemDataKeys);
  const flattenedNodes = useFlattenTree(treeData, {
    ...itemDataKeys
  });
  const {
    expandItemValues,
    handleExpandTreeNode
  } = useExpandTree(data, {
    ...itemDataKeys,
    defaultExpandAll,
    defaultExpandItemValues,
    controlledExpandItemValues,
    onExpand,
    getChildren,
    appendChild
  });
  const handleSelect = useEventCallback((nodeData, nextValue, event) => {
    setValue(nextValue);
    onSelect === null || onSelect === void 0 || onSelect(nodeData, nextValue, event);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
  });
  const treeContext = useMemo(() => ({
    props: {
      childrenKey,
      labelKey,
      valueKey,
      virtualized,
      scrollShadow,
      renderTreeIcon,
      renderTreeNode
    }
  }), [childrenKey, labelKey, valueKey, scrollShadow, virtualized, renderTreeIcon, renderTreeNode]);
  return /*#__PURE__*/React.createElement(TreeProvider, {
    value: treeContext
  }, /*#__PURE__*/React.createElement(TreeView, _extends({
    ref: ref
  }, rest, {
    value: value,
    data: treeData,
    loadingNodeValues: loadingNodeValues,
    flattenedNodes: flattenedNodes,
    expandItemValues: expandItemValues,
    onSelect: handleSelect,
    onExpand: handleExpandTreeNode
  })));
});
Tree.displayName = 'Tree';
export default Tree;