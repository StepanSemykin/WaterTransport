'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import pick from 'lodash/pick';
import isFunction from 'lodash/isFunction';
import isNil from 'lodash/isNil';
import TreeView from "../MultiCascadeTree/TreeView.js";
import SearchView from "../MultiCascadeTree/SearchView.js";
import useActive from "../Cascader/useActive.js";
import { findNodeOfTree } from "../internals/Tree/utils/index.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
import { getColumnsAndPaths } from "../CascadeTree/utils.js";
import { forwardRef, createChainedFunction, mergeRefs } from "../internals/utils/index.js";
import { useCascadeValue, useSearch, useSelect } from "../MultiCascadeTree/hooks/index.js";
import { PickerToggle, PickerPopup, SelectedElement, PickerToggleTrigger, usePickerRef, useToggleKeyDownEvent, useFocusItemValue, triggerPropKeys } from "../internals/Picker/index.js";
const emptyArray = [];

/**
 * The `MultiCascader` component is used to select multiple values from cascading options.
 * @see https://rsuitejs.com/components/multi-cascader/
 */
const MultiCascader = forwardRef((props, ref) => {
  var _selectedPaths;
  const {
    propsWithDefaults,
    rtl
  } = useCustom('MultiCascader', props);
  const {
    as,
    appearance = 'default',
    block,
    className,
    cleanable = true,
    classPrefix = 'picker',
    columnHeight,
    columnWidth,
    childrenKey = 'children',
    countable = true,
    cascade = true,
    data = emptyArray,
    defaultValue,
    disabled,
    disabledItemValues = emptyArray,
    id,
    labelKey = 'label',
    locale,
    placeholder,
    placement = 'bottomStart',
    popupClassName,
    popupStyle,
    renderColumn,
    renderExtraFooter,
    renderTreeNode,
    renderValue,
    searchable = true,
    style,
    size,
    toggleAs,
    uncheckableItemValues = emptyArray,
    value: valueProp,
    valueKey = 'value',
    getChildren,
    onClean,
    onChange,
    onCheck,
    onEnter,
    onExit,
    onSearch,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const {
    trigger,
    root,
    target,
    overlay,
    searchInput
  } = usePickerRef(ref);
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  const onSelectCallback = useCallback((node, cascadePaths, event) => {
    var _trigger$current, _trigger$current$upda;
    onSelect === null || onSelect === void 0 || onSelect(node, cascadePaths, event);
    (_trigger$current = trigger.current) === null || _trigger$current === void 0 || (_trigger$current$upda = _trigger$current.updatePosition) === null || _trigger$current$upda === void 0 || _trigger$current$upda.call(_trigger$current);
  }, [onSelect, trigger]);
  const {
    selectedPaths,
    flattenData,
    columnData,
    setColumnData,
    setSelectedPaths,
    handleSelect
  } = useSelect({
    data,
    childrenKey,
    labelKey,
    valueKey,
    onSelect: onSelectCallback,
    getChildren
  });
  const [controlledValue] = useControlled(valueProp, defaultValue);
  const itemKeys = {
    childrenKey,
    labelKey,
    valueKey
  };
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
    setValue,
    handleCheck
  } = useCascadeValue(cascadeValueProps, flattenData);
  const selectedItems = flattenData.filter(item => value.some(v => v === item[valueKey])) || [];
  const onFocusItemCallback = useCallback(value => {
    const {
      columns,
      path
    } = getColumnsAndPaths(data, flattenData.find(item => item[valueKey] === value), {
      getParent: () => undefined,
      getChildren: item => item[childrenKey]
    });
    setColumnData(columns);
    setSelectedPaths(path);
  }, [childrenKey, data, flattenData, setColumnData, setSelectedPaths, valueKey]);

  // Used to hover the focuse item  when trigger `onKeydown`
  const {
    focusItemValue,
    setLayer,
    setKeys,
    onKeyDown: onFocusItem
  } = useFocusItemValue(selectedPaths === null || selectedPaths === void 0 || (_selectedPaths = selectedPaths[selectedPaths.length - 1]) === null || _selectedPaths === void 0 ? void 0 : _selectedPaths[valueKey], {
    rtl,
    data: flattenData,
    valueKey,
    defaultLayer: selectedPaths !== null && selectedPaths !== void 0 && selectedPaths.length ? selectedPaths.length - 1 : 0,
    target: () => overlay.current,
    callback: onFocusItemCallback
  });
  const onSearchCallback = (value, event) => {
    if (value) {
      setLayer(0);
    } else if (selectedPaths !== null && selectedPaths !== void 0 && selectedPaths.length) {
      setLayer(selectedPaths.length - 1);
    }
    setKeys([]);
    onSearch === null || onSearch === void 0 || onSearch(value, event);
  };
  const {
    items,
    searchKeyword,
    setSearchKeyword,
    handleSearch
  } = useSearch({
    labelKey,
    valueKey,
    childrenKey,
    flattenedData: flattenData,
    uncheckableItemValues,
    onSearch: onSearchCallback
  });
  const {
    active,
    events
  } = useActive({
    onEnter,
    onExit,
    target,
    setSearchKeyword
  });
  const handleClean = useEventCallback(event => {
    if (disabled || !target.current) {
      return;
    }
    setSelectedPaths([]);
    setValue([]);
    setColumnData([data]);
    onChange === null || onChange === void 0 || onChange([], event);
  });
  const handleMenuPressEnter = useEventCallback(event => {
    var _overlay$current;
    const focusItem = findNodeOfTree(data, item => item[valueKey] === focusItemValue);
    const checkbox = (_overlay$current = overlay.current) === null || _overlay$current === void 0 ? void 0 : _overlay$current.querySelector(`[data-key="${focusItemValue}"] [type="checkbox"]`);
    if (checkbox) {
      handleCheck(focusItem, event, (checkbox === null || checkbox === void 0 ? void 0 : checkbox.getAttribute('aria-checked')) !== 'true');
    }
  });
  const onPickerKeyDown = useToggleKeyDownEvent({
    toggle: !focusItemValue || !active,
    trigger,
    target,
    overlay,
    searchInput,
    active,
    onExit: handleClean,
    onMenuKeyDown: onFocusItem,
    onMenuPressEnter: handleMenuPressEnter,
    ...rest
  });
  const renderCascadeColumn = (childNodes, column) => {
    if (typeof renderColumn === 'function') {
      return renderColumn(childNodes, column);
    }
    return childNodes;
  };
  const renderCascadeTreeNode = (node, itemData) => {
    if (typeof renderTreeNode === 'function') {
      return renderTreeNode(node, itemData);
    }
    return node;
  };
  const renderTreeView = (positionProps, speakerRef) => {
    const {
      className
    } = positionProps || {};
    const classes = merge(className, popupClassName, prefix('popup-multi-cascader'));
    return /*#__PURE__*/React.createElement(PickerPopup, {
      ref: mergeRefs(overlay, speakerRef),
      className: classes,
      style: popupStyle,
      target: trigger,
      onKeyDown: onPickerKeyDown
    }, searchable && /*#__PURE__*/React.createElement(SearchView, {
      locale: locale,
      cascade: cascade,
      data: items,
      value: value,
      searchKeyword: searchKeyword,
      valueKey: valueKey,
      labelKey: labelKey,
      childrenKey: childrenKey,
      disabledItemValues: disabledItemValues,
      inputRef: searchInput,
      onCheck: handleCheck,
      onSearch: handleSearch
    }), !searchKeyword && /*#__PURE__*/React.createElement(TreeView, {
      cascade: cascade,
      columnWidth: columnWidth,
      columnHeight: columnHeight,
      classPrefix: "cascade-tree",
      uncheckableItemValues: uncheckableItemValues,
      disabledItemValues: disabledItemValues,
      valueKey: valueKey,
      labelKey: labelKey,
      childrenKey: childrenKey,
      cascadeData: columnData,
      cascadePaths: selectedPaths,
      value: value,
      onSelect: handleSelect,
      onCheck: handleCheck,
      renderColumn: renderCascadeColumn,
      renderTreeNode: renderCascadeTreeNode
    }), renderExtraFooter === null || renderExtraFooter === void 0 ? void 0 : renderExtraFooter());
  };
  let selectedElement = placeholder;
  if (selectedItems.length > 0) {
    selectedElement = /*#__PURE__*/React.createElement(SelectedElement, {
      selectedItems: selectedItems,
      countable: countable,
      valueKey: valueKey,
      labelKey: labelKey,
      childrenKey: childrenKey,
      prefix: prefix,
      cascade: cascade,
      locale: locale,
      badgeSize: size
    });
  }

  /**
   * 1.Have a value and the value is valid.
   * 2.Regardless of whether the value is valid, as long as renderValue is set, it is judged to have a value.
   */
  let hasValue = selectedItems.length > 0 || Number(valueProp === null || valueProp === void 0 ? void 0 : valueProp.length) > 0 && isFunction(renderValue);
  if (hasValue && isFunction(renderValue)) {
    selectedElement = renderValue(value.length ? value : valueProp !== null && valueProp !== void 0 ? valueProp : [], selectedItems, selectedElement);
    // If renderValue returns null or undefined, hasValue is false.
    if (isNil(selectedElement)) {
      hasValue = false;
    }
  }
  const triggerProps = {
    ...pick(props, triggerPropKeys),
    ...events
  };
  return /*#__PURE__*/React.createElement(PickerToggleTrigger, {
    as: as,
    id: id,
    pickerType: "multi-cascader",
    block: block,
    disabled: disabled,
    appearance: appearance,
    popupType: "tree",
    multiple: true,
    triggerProps: triggerProps,
    ref: trigger,
    placement: placement,
    speaker: renderTreeView,
    rootRef: root,
    style: style,
    classPrefix: classPrefix,
    className: className
  }, /*#__PURE__*/React.createElement(PickerToggle, _extends({
    ref: target,
    as: toggleAs,
    appearance: appearance,
    disabled: disabled,
    onClean: createChainedFunction(handleClean, onClean),
    onKeyDown: onPickerKeyDown,
    cleanable: cleanable && !disabled,
    countable: countable,
    hasValue: hasValue,
    active: active,
    placement: placement,
    inputValue: value,
    size: size
  }, rest), selectedElement || (locale === null || locale === void 0 ? void 0 : locale.placeholder)));
});
MultiCascader.displayName = 'MultiCascader';
export default MultiCascader;