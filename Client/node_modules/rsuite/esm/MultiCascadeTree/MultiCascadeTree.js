'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import TreeView from "./TreeView.js";
import SearchView from "./SearchView.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useCascadeValue, useSelect, useSearch } from "./hooks/index.js";
import { useStyles, useCustom, useControlled } from "../internals/hooks/index.js";
const emptyArray = [];

/**
 * The `MultiCascadeTree` component is used to select multiple values from cascading options.
 * @see https://rsuitejs.com/components/multi-cascade-tree/
 */
const MultiCascadeTree = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('MultiCascadeTree', props);
  const {
    as,
    data = emptyArray,
    defaultValue,
    className,
    classPrefix = 'cascade-tree',
    value: valueProp,
    valueKey = 'value',
    labelKey = 'label',
    locale,
    childrenKey = 'children',
    disabledItemValues = emptyArray,
    cascade = true,
    columnWidth,
    columnHeight,
    searchable,
    uncheckableItemValues = emptyArray,
    getChildren,
    renderColumn,
    renderTreeNode,
    onSelect,
    onCheck,
    onChange,
    onSearch,
    ...rest
  } = propsWithDefaults;
  const itemKeys = {
    childrenKey,
    labelKey,
    valueKey
  };
  const {
    selectedPaths,
    flattenData,
    columnData,
    handleSelect
  } = useSelect({
    data,
    childrenKey,
    labelKey,
    valueKey,
    onSelect,
    getChildren
  });
  const [controlledValue] = useControlled(valueProp, defaultValue);
  const cascadeValueProps = {
    ...itemKeys,
    uncheckableItemValues,
    cascade,
    value: controlledValue,
    onCheck,
    onChange
  };
  const {
    value,
    handleCheck
  } = useCascadeValue(cascadeValueProps, flattenData);
  const {
    items,
    searchKeyword,
    handleSearch
  } = useSearch({
    labelKey,
    valueKey,
    childrenKey,
    flattenedData: flattenData,
    uncheckableItemValues,
    onSearch
  });
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix('multi'));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes
  }, rest), searchable && /*#__PURE__*/React.createElement(SearchView, {
    cascade: cascade,
    data: items,
    value: value,
    searchKeyword: searchKeyword,
    valueKey: valueKey,
    labelKey: labelKey,
    locale: locale,
    childrenKey: childrenKey,
    disabledItemValues: disabledItemValues,
    onCheck: handleCheck,
    onSearch: handleSearch
  }), !searchKeyword && /*#__PURE__*/React.createElement(TreeView, {
    cascade: cascade,
    columnWidth: columnWidth,
    columnHeight: columnHeight,
    uncheckableItemValues: uncheckableItemValues,
    disabledItemValues: disabledItemValues,
    valueKey: valueKey,
    labelKey: labelKey,
    childrenKey: childrenKey,
    classPrefix: classPrefix,
    cascadeData: columnData,
    cascadePaths: selectedPaths,
    value: value,
    onSelect: handleSelect,
    onCheck: handleCheck,
    renderColumn: renderColumn,
    renderTreeNode: renderTreeNode
  }));
});
MultiCascadeTree.displayName = 'MultiCascadeTree';
export default MultiCascadeTree;