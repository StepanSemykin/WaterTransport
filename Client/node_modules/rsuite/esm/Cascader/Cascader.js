'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useMemo } from 'react';
import pick from 'lodash/pick';
import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';
import TreeView from "../CascadeTree/TreeView.js";
import SearchView from "../CascadeTree/SearchView.js";
import { usePaths, useSelect, useSearch } from "../CascadeTree/hooks/index.js";
import { flattenTree } from "../Tree/utils/index.js";
import { findNodeOfTree, getParentMap } from "../internals/Tree/utils/index.js";
import { useControlled, useStyles, useCustom, useEventCallback, useMap } from "../internals/hooks/index.js";
import { forwardRef, createChainedFunction, mergeRefs, shallowEqual } from "../internals/utils/index.js";
import { PickerToggle, PickerPopup, PickerToggleTrigger, usePickerRef, useToggleKeyDownEvent, useFocusItemValue, triggerPropKeys } from "../internals/Picker/index.js";
import useActive from "./useActive.js";
const emptyArray = [];
/**
 * The `Cascader` component displays a hierarchical list of options.
 * @see https://rsuitejs.com/components/cascader
 */
const Cascader = forwardRef((props, ref) => {
  const {
    rtl,
    propsWithDefaults
  } = useCustom('Cascader', props);
  const {
    appearance = 'default',
    as,
    block,
    className,
    cleanable = true,
    classPrefix = 'picker',
    columnHeight,
    columnWidth,
    data = emptyArray,
    defaultValue,
    disabled,
    disabledItemValues = emptyArray,
    childrenKey = 'children',
    id,
    labelKey = 'label',
    locale,
    parentSelectable,
    placeholder,
    placement = 'bottomStart',
    popupClassName,
    popupStyle,
    renderColumn,
    renderExtraFooter,
    renderSearchItem,
    renderTreeNode,
    renderValue,
    searchable = true,
    style,
    toggleAs,
    value: valueProp,
    valueKey = 'value',
    onClean,
    onChange,
    onEnter,
    onExit,
    onSearch,
    onSelect,
    getChildren,
    ...rest
  } = propsWithDefaults;
  const {
    trigger,
    root,
    target,
    overlay,
    searchInput
  } = usePickerRef(ref);
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
    var _trigger$current;
    const {
      isLeafNode,
      cascadePaths,
      itemData
    } = node;
    onSelect === null || onSelect === void 0 || onSelect(itemData, cascadePaths, event);
    const nextValue = itemData[valueKey];
    if (isLeafNode) {
      // Determines whether the option is a leaf node, and if so, closes the picker.
      handleClose();
      setValue(nextValue);
      return;
    }

    //  When the parent is optional, the value and the displayed path are updated.
    if (parentSelectable && !shallowEqual(value, nextValue)) {
      setValue(nextValue);
      onChange === null || onChange === void 0 || onChange(nextValue, event);
    }

    // Update menu position
    (_trigger$current = trigger.current) === null || _trigger$current === void 0 || _trigger$current.updatePosition();
  };
  const {
    activeItem,
    setActiveItem,
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
    pathTowardsActiveItem,
    pathTowardsSelectedItem
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

  /**
   * 1.Have a value and the value is valid.
   * 2.Regardless of whether the value is valid, as long as renderValue is set, it is judged to have a value.
   */
  let hasValue = pathTowardsSelectedItem.length > 0 || !isNil(value) && isFunction(renderValue);
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  const onFocusItemCallback = useCallback(value => {
    setActiveItem(flattenedData.find(item => item[valueKey] === value));
  }, [flattenedData, setActiveItem, valueKey]);

  // Used to hover the focuse item  when trigger `onKeydown`
  const {
    focusItemValue,
    setFocusItemValue,
    setLayer,
    setKeys,
    onKeyDown: onFocusItem
  } = useFocusItemValue(value, {
    rtl,
    data: flattenedData,
    valueKey,
    defaultLayer: pathTowardsSelectedItem !== null && pathTowardsSelectedItem !== void 0 && pathTowardsSelectedItem.length ? pathTowardsSelectedItem.length - 1 : 0,
    target: () => overlay.current,
    getParent: item => parentMap.get(item),
    callback: onFocusItemCallback
  });
  const onSearchCallback = (value, items, event) => {
    onSearch === null || onSearch === void 0 || onSearch(value, event);
    if (!value || items.length === 0) {
      setFocusItemValue(undefined);
      return;
    }
    if (items.length > 0) {
      setFocusItemValue(items[0][valueKey]);
      setLayer(0);
      setKeys([]);
    }
  };
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
    parentSelectable,
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
  const handleClose = useEventCallback(() => {
    var _trigger$current2, _target$current, _target$current$focus;
    (_trigger$current2 = trigger.current) === null || _trigger$current2 === void 0 || _trigger$current2.close();

    // The focus is on the trigger button after closing
    (_target$current = target.current) === null || _target$current === void 0 || (_target$current$focus = _target$current.focus) === null || _target$current$focus === void 0 || _target$current$focus.call(_target$current);
  });
  const handleClean = useEventCallback(event => {
    if (disabled || !target.current) {
      return;
    }
    setValue(null);
    onChange === null || onChange === void 0 || onChange(null, event);
  });
  const handleMenuPressEnter = useEventCallback(event => {
    const focusItem = findNodeOfTree(data, item => item[valueKey] === focusItemValue);
    const isLeafNode = focusItem && !focusItem[childrenKey];
    if (isLeafNode) {
      setValue(focusItemValue);
      if (pathTowardsActiveItem.length) {
        setLayer(pathTowardsActiveItem.length - 1);
      }
      if (!shallowEqual(value, focusItemValue)) {
        onSelect === null || onSelect === void 0 || onSelect(focusItem, pathTowardsActiveItem, event);
        onChange === null || onChange === void 0 || onChange(focusItemValue !== null && focusItemValue !== void 0 ? focusItemValue : null, event);
      }
      handleClose();
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

  /**
   * The search structure option is processed after being selected.
   */
  const handleSearchRowSelect = useEventCallback((itemData, nodes, event) => {
    const nextValue = itemData[valueKey];
    handleClose();
    setSearchKeyword('');
    setValue(nextValue);
    onSelect === null || onSelect === void 0 || onSelect(itemData, nodes, event);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
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
    const classes = merge(className, popupClassName, prefix('popup-cascader'));
    return /*#__PURE__*/React.createElement(PickerPopup, {
      ref: mergeRefs(overlay, speakerRef),
      className: classes,
      style: popupStyle,
      target: trigger,
      onKeyDown: onPickerKeyDown
    }, searchable && /*#__PURE__*/React.createElement(SearchView, {
      data: items,
      searchKeyword: searchKeyword,
      valueKey: valueKey,
      labelKey: labelKey,
      locale: locale,
      parentMap: parentMap,
      disabledItemValues: disabledItemValues,
      focusItemValue: focusItemValue,
      inputRef: searchInput,
      renderSearchItem: renderSearchItem,
      onSelect: handleSearchRowSelect,
      onSearch: handleSearch
    }), searchKeyword === '' && /*#__PURE__*/React.createElement(TreeView, {
      columnWidth: columnWidth,
      columnHeight: columnHeight,
      disabledItemValues: disabledItemValues,
      loadingItemsSet: loadingItemsSet,
      valueKey: valueKey,
      labelKey: labelKey,
      childrenKey: childrenKey,
      classPrefix: 'cascade-tree',
      data: columns,
      cascadePaths: pathTowardsActiveItem,
      activeItemValue: value,
      onSelect: handleSelect,
      renderColumn: renderCascadeColumn,
      renderTreeNode: renderCascadeTreeNode
    }), renderExtraFooter === null || renderExtraFooter === void 0 ? void 0 : renderExtraFooter());
  };
  let selectedElement = placeholder;
  if (pathTowardsSelectedItem.length > 0) {
    selectedElement = [];
    pathTowardsSelectedItem.forEach((item, index) => {
      const key = item[valueKey] || item[labelKey];
      selectedElement.push(/*#__PURE__*/React.createElement("span", {
        key: key
      }, item[labelKey]));
      if (index < pathTowardsSelectedItem.length - 1) {
        selectedElement.push(/*#__PURE__*/React.createElement("span", {
          className: "separator",
          key: `${key}-separator`
        }, ' / '));
      }
    });
  }
  if (!isNil(value) && isFunction(renderValue)) {
    selectedElement = renderValue(value, pathTowardsSelectedItem, selectedElement);
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
    pickerType: "cascader",
    block: block,
    disabled: disabled,
    appearance: appearance,
    popupType: "tree",
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
    hasValue: hasValue,
    active: active,
    placement: placement,
    inputValue: value !== null && value !== void 0 ? value : '',
    focusItemValue: focusItemValue
  }, rest), selectedElement || (locale === null || locale === void 0 ? void 0 : locale.placeholder)));
});
Cascader.displayName = 'Cascader';
export default Cascader;