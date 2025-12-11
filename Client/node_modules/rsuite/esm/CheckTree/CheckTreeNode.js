'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import ListCheckItem from "../internals/Picker/ListCheckItem.js";
import TreeNodeToggle from "../Tree/TreeNodeToggle.js";
import { forwardRef, stringifyReactNode, mergeRefs } from "../internals/utils/index.js";
import { useTreeContextProps } from "../internals/Tree/TreeProvider.js";
import { CHECK_STATE } from "../internals/constants/index.js";
import { indentTreeNode } from "../Tree/utils/index.js";
import { useStyles, useCustom, useEventCallback, useFocusVirtualListItem } from "../internals/hooks/index.js";
const CheckTreeNode = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    style,
    className,
    classPrefix = 'check-tree-node',
    visible = true,
    layer,
    disabled,
    allUncheckable,
    loading,
    expanded,
    hasChildren,
    nodeData,
    focus,
    label,
    uncheckable,
    checkState,
    value,
    treeItemRef,
    onExpand,
    onSelect,
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
    // stop propagation when using custom loading icon
    event === null || event === void 0 || (_event$nativeEvent = event.nativeEvent) === null || _event$nativeEvent === void 0 || (_event$nativeEvent$st = _event$nativeEvent.stopImmediatePropagation) === null || _event$nativeEvent$st === void 0 || _event$nativeEvent$st.call(_event$nativeEvent);
    onExpand === null || onExpand === void 0 || onExpand(nodeData, expanded);
  });
  const handleSelect = useEventCallback((_value, event) => {
    let isChecked = false;
    if (checkState === CHECK_STATE.UNCHECK || checkState === CHECK_STATE.INDETERMINATE) {
      isChecked = true;
    }
    if (checkState === CHECK_STATE.CHECK) {
      isChecked = false;
    }
    const nextNodeData = {
      ...nodeData,
      check: isChecked
    };
    onSelect === null || onSelect === void 0 || onSelect(nextNodeData, event);
  });
  const classes = merge(className, withPrefix({
    disabled,
    'all-uncheckable': !!allUncheckable,
    'text-muted': disabled,
    focus
  }));
  const styles = virtualized ? {
    ...style,
    ...indentTreeNode(rtl, layer - 1)
  } : style;
  const itemRef = useFocusVirtualListItem(focus);
  return visible ? /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    style: styles,
    className: classes,
    ref: ref
  }), /*#__PURE__*/React.createElement(TreeNodeToggle, {
    "aria-label": (expanded ? 'Collapse' : 'Expand') + ` ${labelStr}`,
    data: nodeData,
    expanded: expanded,
    loading: loading,
    hasChildren: hasChildren,
    onClick: handleExpand
  }), /*#__PURE__*/React.createElement(ListCheckItem, {
    as: "div",
    role: "treeitem",
    ref: mergeRefs(itemRef, treeItemRef),
    "aria-label": labelStr,
    "aria-expanded": expanded,
    "aria-checked": checkState === CHECK_STATE.CHECK,
    "aria-selected": focus,
    "aria-disabled": disabled,
    "aria-level": layer,
    "data-layer": layer,
    active: checkState === CHECK_STATE.CHECK,
    indeterminate: checkState === CHECK_STATE.INDETERMINATE,
    focus: focus,
    checkable: !uncheckable,
    disabled: disabled,
    value: nodeData.refKey || value,
    className: prefix('content'),
    title: labelStr,
    onSelect: handleSelect
  }, typeof renderTreeNode === 'function' ? renderTreeNode(nodeData) : label)) : null;
});
CheckTreeNode.displayName = 'CheckTreeNode';
export default CheckTreeNode;