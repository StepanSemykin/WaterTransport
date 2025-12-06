'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo } from 'react';
import TreeView from "./TreeView.js";
import SearchView from "./SearchView.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { getParentMap } from "../internals/Tree/utils/index.js";
import { flattenTree } from "../Tree/utils/index.js";
import { useMap, useControlled, useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { useSearch, useSelect, usePaths } from "./hooks/index.js";
/**
 * CascadeTree is a component that displays tree-structured data in columns.
 *
 * @see https://rsuitejs.com/components/cascade-tree
 */
const CascadeTree = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('CascadeTree', props);
  const {
    as,
    data = [],
    defaultValue,
    className,
    classPrefix = 'cascade-tree',
    childrenKey = 'children',
    valueKey = 'value',
    labelKey = 'label',
    locale,
    value: valueProp,
    disabledItemValues = [],
    columnWidth,
    columnHeight,
    searchable,
    renderTreeNode,
    renderColumn,
    onSelect,
    onSearch,
    onChange,
    getChildren,
    ...rest
  } = propsWithDefaults;
  const [value, setValue] = useControlled(valueProp, defaultValue);

  // Store the children of each node
  const childrenMap = useMap();

  // Store the parent of each node
  const parentMap = useMemo(() => getParentMap(data, item => {
    var _childrenMap$get;
    return (_childrenMap$get = childrenMap.get(item)) !== null && _childrenMap$get !== void 0 ? _childrenMap$get : item[childrenKey];
  }), [childrenMap, childrenKey, data]);

  // Flatten the tree data
  const flattenedData = useMemo(() => flattenTree(data, item => {
    var _childrenMap$get2;
    return (_childrenMap$get2 = childrenMap.get(item)) !== null && _childrenMap$get2 !== void 0 ? _childrenMap$get2 : item[childrenKey];
  }), [childrenMap, childrenKey, data]);

  // The selected item
  const selectedItem = flattenedData.find(item => item[valueKey] === value);

  // Callback function after selecting the node
  const onSelectCallback = (node, event) => {
    const {
      isLeafNode,
      cascadePaths,
      itemData
    } = node;
    onSelect === null || onSelect === void 0 || onSelect(itemData, cascadePaths, event);
    if (isLeafNode) {
      const nextValue = itemData[valueKey];
      setValue(nextValue);
    }
  };
  const {
    activeItem,
    loadingItemsSet,
    handleSelect
  } = useSelect({
    value,
    valueKey,
    childrenKey,
    childrenMap,
    selectedItem,
    getChildren,
    onChange,
    onSelect: onSelectCallback
  });
  const {
    columns,
    pathTowardsActiveItem
  } = usePaths({
    data,
    activeItem,
    selectedItem,
    getParent: item => parentMap.get(item),
    getChildren: item => {
      var _childrenMap$get3;
      return (_childrenMap$get3 = childrenMap.get(item)) !== null && _childrenMap$get3 !== void 0 ? _childrenMap$get3 : item[childrenKey];
    }
  });
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const onSearchCallback = useCallback((value, _items, event) => onSearch === null || onSearch === void 0 ? void 0 : onSearch(value, event), [onSearch]);
  const {
    items,
    searchKeyword,
    setSearchKeyword,
    handleSearch
  } = useSearch({
    labelKey,
    childrenKey,
    parentMap,
    flattenedData,
    onSearch: onSearchCallback
  });
  const handleSearchRowSelect = useEventCallback((item, items, event) => {
    var _item$childrenKey;
    const node = {
      itemData: item,
      cascadePaths: items,
      isLeafNode: !((_item$childrenKey = item[childrenKey]) !== null && _item$childrenKey !== void 0 && _item$childrenKey.length)
    };
    handleSelect(node, event);
    setSearchKeyword('');
  });
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    className: classes
  }, rest, {
    ref: ref
  }), searchable && /*#__PURE__*/React.createElement(SearchView, {
    data: items,
    searchKeyword: searchKeyword,
    valueKey: valueKey,
    labelKey: labelKey,
    locale: locale,
    parentMap: parentMap,
    disabledItemValues: disabledItemValues,
    onSelect: handleSearchRowSelect,
    onSearch: handleSearch
  }), !searchKeyword && /*#__PURE__*/React.createElement(TreeView, {
    columnWidth: columnWidth,
    columnHeight: columnHeight,
    disabledItemValues: disabledItemValues,
    loadingItemsSet: loadingItemsSet,
    valueKey: valueKey,
    labelKey: labelKey,
    childrenKey: childrenKey,
    classPrefix: classPrefix,
    data: columns,
    cascadePaths: pathTowardsActiveItem,
    activeItemValue: value,
    onSelect: handleSelect,
    renderColumn: renderColumn,
    renderTreeNode: renderTreeNode
  }));
});
CascadeTree.displayName = 'CascadeTree';
export default CascadeTree;