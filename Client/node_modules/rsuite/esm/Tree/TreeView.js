'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useEffect, useMemo } from 'react';
import isNil from 'lodash/isNil';
import TreeViewNode from "./TreeNode.js";
import IndentLine from "./IndentLine.js";
import useTreeSearch from "./hooks/useTreeSearch.js";
import useTreeDrag from "./hooks/useTreeDrag.js";
import useFocusTree from "./hooks/useFocusTree.js";
import useVirtualizedTreeData from "./hooks/useVirtualizedTreeData.js";
import useTreeNodeProps from "./hooks/useTreeNodeProps.js";
import SearchBox from "../internals/SearchBox/index.js";
import Box from "../internals/Box/index.js";
import { List, AutoSizer, defaultItemSize } from "../internals/Windowing/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { getPathTowardsItem, getKeyParentMap } from "../internals/Tree/utils/index.js";
import { useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { isExpand, hasVisibleChildren, getActiveItem } from "./utils/index.js";
import { onMenuKeyDown } from "../internals/Picker/index.js";
import { TreeView as BaseTreeView } from "../internals/Tree/index.js";
import { useTreeContextProps } from "../internals/Tree/TreeProvider.js";

/**
 * Props for the TreeViewInner component.
 */
/**
 * Represents the props for the TreeView component.
 */

const TreeView = forwardRef((props, ref) => {
  const {
    as,
    data = [],
    style,
    showIndentLine,
    value: valueProp,
    locale: overrideLocale,
    height = 360,
    className,
    searchable = false,
    classPrefix = 'tree',
    searchKeyword,
    searchBy,
    draggable,
    disabledItemValues = [],
    loadingNodeValues = [],
    flattenedNodes = {},
    listProps,
    listRef,
    searchInputRef,
    expandItemValues = [],
    onSearch,
    onSelect,
    onSelectItem,
    onDragEnd,
    onDragStart,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    onExpand,
    onFocusItem,
    onScroll,
    ...rest
  } = props;
  const {
    getLocale
  } = useCustom();
  const {
    searchPlaceholder,
    noResultsText
  } = getLocale('Combobox', overrideLocale);
  const {
    valueKey,
    childrenKey,
    scrollShadow,
    virtualized
  } = useTreeContextProps();
  const {
    prefix,
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const handleSearchCallback = useEventCallback((value, _data, event) => {
    onSearch === null || onSearch === void 0 || onSearch(value, event);
  });
  const {
    filteredData,
    keyword,
    setFilteredData,
    handleSearch
  } = useTreeSearch({
    callback: handleSearchCallback,
    searchKeyword,
    data,
    searchBy
  });
  const transformation = useVirtualizedTreeData(flattenedNodes, filteredData, {
    expandItemValues,
    searchKeyword: keyword
  });
  const getFormattedNodes = render => {
    if (virtualized) {
      return transformation().filter(n => n.visible);
    }
    return filteredData.map((dataItem, index) => render === null || render === void 0 ? void 0 : render(dataItem, index, 1)).filter(n => n);
  };
  useEffect(() => {
    setFilteredData(data, keyword);
  }, [data, keyword, setFilteredData]);

  // TODO-Doma
  // Replace `getKeyParentMap` with `getParentMap`
  const itemParentMap = useMemo(() => getKeyParentMap(data, node => node[valueKey], node => node[childrenKey]), [childrenKey, data, valueKey]);
  const {
    focusItemValue,
    setFocusItemValue,
    onTreeKeydown,
    treeNodesRefs,
    saveTreeNodeRef,
    treeViewRef
  } = useFocusTree({
    filteredData,
    disabledItemValues,
    expandItemValues,
    searchKeyword: keyword,
    flattenedNodes,
    onFocused: onFocusItem,
    onExpand
  });
  const {
    dragNode,
    dragOverNodeKey,
    dropNodePosition,
    dragEvents
  } = useTreeDrag({
    flattenedNodes,
    treeNodesRefs,
    draggable,
    onDragStart,
    onDragEnter,
    onDragOver,
    onDragLeave,
    onDragEnd,
    onDrop,
    prefix
  });
  const getTreeNodeProps = useTreeNodeProps({
    value: valueProp,
    disabledItemValues,
    loadingNodeValues,
    focusItemValue,
    keyword,
    dragNode,
    dragOverNodeKey,
    dropNodePosition
  });
  const handleSelect = useEventCallback((nodeData, event) => {
    if (!nodeData) {
      return;
    }
    const nextValue = nodeData[valueKey];
    const path = getPathTowardsItem(nodeData, item => itemParentMap.get(item[valueKey]));
    setFocusItemValue(nextValue);
    onSelect === null || onSelect === void 0 || onSelect(nodeData, nextValue, event);
    onSelectItem === null || onSelectItem === void 0 || onSelectItem(nodeData, path);
  });
  const selectActiveItem = useEventCallback(event => {
    if (isNil(focusItemValue)) return;
    const activeItem = getActiveItem(focusItemValue, flattenedNodes, valueKey);
    handleSelect(activeItem, event);
  });
  const handleTreeKeyDown = useEventCallback(event => {
    onTreeKeydown(event);
    onMenuKeyDown(event, {
      enter: selectActiveItem
    });
  });
  const renderNode = (node, index, layer) => {
    const {
      visible
    } = node;
    if (!visible) {
      return null;
    }
    const children = node[childrenKey];
    const expanded = isExpand(keyword, expandItemValues.includes(node[valueKey]));
    const hasChildren = keyword ? hasVisibleChildren(node, childrenKey) : Boolean(children);
    const nodeProps = {
      ...getTreeNodeProps(node, layer, index),
      ...dragEvents,
      expanded,
      draggable,
      onExpand,
      onSelect: handleSelect,
      hasChildren
    };
    if (hasChildren) {
      layer += 1;
      const childClassName = merge(prefix('node-children'), {
        [prefix('node-expanded')]: expanded
      });
      return /*#__PURE__*/React.createElement("div", {
        className: childClassName,
        key: node[valueKey]
      }, /*#__PURE__*/React.createElement(TreeViewNode, _extends({}, nodeProps, {
        ref: ref => saveTreeNodeRef(ref, node.refKey)
      })), /*#__PURE__*/React.createElement("div", {
        className: prefix('group'),
        role: "group"
      }, children === null || children === void 0 ? void 0 : children.map((child, i) => renderNode(child, i, layer)), showIndentLine && /*#__PURE__*/React.createElement(IndentLine, null)));
    }
    return /*#__PURE__*/React.createElement(TreeViewNode, _extends({
      ref: ref => saveTreeNodeRef(ref, node.refKey),
      key: node[valueKey]
    }, nodeProps));
  };
  const renderVirtualListNode = ({
    index,
    style,
    data
  }) => {
    const node = data[index];
    const {
      layer,
      visible,
      hasChildren
    } = node;
    const expanded = isExpand(keyword, expandItemValues.includes(node[valueKey]));
    if (!visible) {
      return null;
    }
    const treeNodeProps = {
      ...getTreeNodeProps(node, layer),
      ...dragEvents,
      expanded,
      style,
      onExpand,
      onSelect: handleSelect,
      hasChildren
    };
    return visible && /*#__PURE__*/React.createElement(TreeViewNode, _extends({
      ref: ref => saveTreeNodeRef(ref, node.refKey)
    }, treeNodeProps));
  };
  const classes = merge(withPrefix({
    virtualized
  }), className);
  const formattedNodes = getFormattedNodes(renderNode);
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    ref: ref,
    className: classes,
    style: style
  }, searchable ? /*#__PURE__*/React.createElement(SearchBox, {
    placeholder: searchPlaceholder,
    onChange: handleSearch,
    value: keyword,
    inputRef: searchInputRef
  }) : null, keyword && formattedNodes.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: prefix('empty')
  }, noResultsText) : null, /*#__PURE__*/React.createElement(BaseTreeView, _extends({}, rest, {
    ref: treeViewRef,
    treeRootClassName: prefix('root'),
    onScroll: onScroll,
    onKeyDown: handleTreeKeyDown,
    className: prefix('view'),
    height: height
  }), virtualized ? /*#__PURE__*/React.createElement(AutoSizer, {
    defaultHeight: height,
    style: {
      width: 'auto',
      height: 'auto'
    },
    className: prefix('virt-auto-sizer')
  }, ({
    height
  }) => /*#__PURE__*/React.createElement(List, _extends({
    ref: listRef,
    height: height,
    itemSize: defaultItemSize,
    itemCount: formattedNodes.length,
    itemData: formattedNodes,
    className: prefix('virt-list'),
    scrollShadow: scrollShadow
  }, listProps), renderVirtualListNode)) : formattedNodes));
});
TreeView.displayName = 'TreeView';
export default TreeView;