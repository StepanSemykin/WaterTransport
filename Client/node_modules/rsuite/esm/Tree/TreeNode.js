'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import TreeNodeToggle from "./TreeNodeToggle.js";
import Box from "../internals/Box/index.js";
import { forwardRef, mergeRefs, stringifyReactNode, mergeStyles } from "../internals/utils/index.js";
import { useFocusVirtualListItem, useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { useTreeContextProps } from "../internals/Tree/TreeProvider.js";
import { indentTreeNode } from "./utils/index.js";

/**
 * Props for the TreeNode component.
 */

const TreeNode = forwardRef((props, ref) => {
  const {
    as,
    label,
    layer,
    active,
    loading,
    nodeData,
    className,
    classPrefix = 'tree-node',
    disabled,
    visible = true,
    draggable,
    expanded,
    focus,
    style,
    hasChildren,
    dragging,
    dragStatus,
    onSelect,
    onDragStart,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDragEnd,
    onDrop,
    onExpand,
    ...rest
  } = props;
  const {
    rtl
  } = useCustom();
  const {
    renderTreeNode,
    virtualized
  } = useTreeContextProps();
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const labelStr = useMemo(() => stringifyReactNode(label), [label]);
  const handleExpand = useEventCallback(event => {
    var _event$nativeEvent, _event$nativeEvent$st;
    // Stop propagation when using custom loading icon
    event === null || event === void 0 || (_event$nativeEvent = event.nativeEvent) === null || _event$nativeEvent === void 0 || (_event$nativeEvent$st = _event$nativeEvent.stopImmediatePropagation) === null || _event$nativeEvent$st === void 0 || _event$nativeEvent$st.call(_event$nativeEvent);
    event.stopPropagation();
    onExpand === null || onExpand === void 0 || onExpand(nodeData, expanded);
  });
  const handleSelect = useEventCallback(event => {
    if (disabled) {
      return;
    }
    onSelect === null || onSelect === void 0 || onSelect(nodeData, event);
  });
  const handleDragStart = useEventCallback(event => {
    onDragStart === null || onDragStart === void 0 || onDragStart(nodeData, event);
  });
  const handleDragEnter = useEventCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    onDragEnter === null || onDragEnter === void 0 || onDragEnter(nodeData, event);
  });
  const handleDragOver = useEventCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    onDragOver === null || onDragOver === void 0 || onDragOver(nodeData, event);
  });
  const handleDragLeave = useEventCallback(event => {
    event.stopPropagation();
    onDragLeave === null || onDragLeave === void 0 || onDragLeave(nodeData, event);
  });
  const handleDragEnd = useEventCallback(event => {
    event.stopPropagation();
    onDragEnd === null || onDragEnd === void 0 || onDragEnd(nodeData, event);
  });
  const handleDrop = useEventCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    onDrop === null || onDrop === void 0 || onDrop(nodeData, event);
  });
  const classes = merge(className, withPrefix({
    disabled,
    active,
    'text-muted': disabled,
    focus
  }));
  const treeItemRef = useFocusVirtualListItem(focus);
  const styles = virtualized ? mergeStyles(style, indentTreeNode(rtl, layer - 1)) : style;
  return visible ? /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "treeitem",
    ref: mergeRefs(treeItemRef, ref),
    tabIndex: -1,
    "aria-expanded": expanded,
    "aria-label": labelStr,
    "aria-level": layer,
    "aria-disabled": disabled,
    "aria-selected": active,
    "data-layer": layer,
    "data-key": (nodeData === null || nodeData === void 0 ? void 0 : nodeData.refKey) || '',
    title: labelStr,
    className: classes,
    style: styles,
    draggable: draggable,
    onClick: handleSelect,
    onDragStart: handleDragStart,
    onDragEnter: handleDragEnter,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDragEnd: handleDragEnd,
    onDrop: handleDrop
  }, rest), /*#__PURE__*/React.createElement(TreeNodeToggle, {
    "aria-label": (expanded ? 'Collapse' : 'Expand') + ` ${labelStr}`,
    data: nodeData,
    loading: loading,
    expanded: expanded,
    hasChildren: hasChildren,
    onClick: handleExpand
  }), /*#__PURE__*/React.createElement("span", {
    className: prefix('label', dragStatus, {
      dragging
    })
  }, renderTreeNode ? renderTreeNode(nodeData) : label)) : null;
});
TreeNode.displayName = 'TreeNode';
export default TreeNode;