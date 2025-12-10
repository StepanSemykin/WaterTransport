'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import pick from 'lodash/pick';
import isNil from 'lodash/isNil';
import isFunction from 'lodash/isFunction';
import useTreeWithChildren from "../Tree/hooks/useTreeWithChildren.js";
import useFlattenTree from "../Tree/hooks/useFlattenTree.js";
import useFocusState from "./hooks/useFocusState.js";
import useExpandTree from "../Tree/hooks/useExpandTree.js";
import TreeView from "../Tree/TreeView.js";
import { useStyles, useCustom, useControlled, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, createChainedFunction, mergeRefs } from "../internals/utils/index.js";
import { getActiveItem, getTreeActiveNode } from "../Tree/utils/index.js";
import { PickerToggle, PickerPopup, PickerToggleTrigger, usePickerRef, onMenuKeyDown, triggerPropKeys, useToggleKeyDownEvent } from "../internals/Picker/index.js";
import { isLeafNode } from "../internals/Tree/utils/index.js";
import { TreeProvider, useTreeImperativeHandle } from "../internals/Tree/TreeProvider.js";
/**
 * The `TreePicker` component is used for selecting single options which are organized in a tree structure.
 *
 * @see https://rsuitejs.com/components/tree-picker/
 */
const TreePicker = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('TreePicker', props);
  const {
    as,
    appearance = 'default',
    classPrefix = 'picker',
    cleanable = true,
    childrenKey = 'children',
    data = [],
    disabled,
    defaultValue,
    defaultExpandAll = false,
    disabledItemValues = [],
    defaultExpandItemValues = [],
    expandItemValues: controlledExpandItemValues,
    id,
    block,
    className,
    locale,
    labelKey = 'label',
    onlyLeafSelectable,
    placeholder,
    placement = 'bottomStart',
    style,
    searchKeyword,
    searchable = true,
    showIndentLine,
    popupClassName,
    popupStyle,
    popupAutoWidth = true,
    treeHeight = 320,
    valueKey = 'value',
    virtualized = false,
    value: controlledValue,
    listProps,
    toggleAs,
    searchBy,
    getChildren,
    onClean,
    onSearch,
    onSelect,
    onSelectItem,
    onChange,
    onExpand,
    onEnter,
    onExit,
    onEntered,
    renderValue,
    renderTree,
    renderTreeIcon,
    renderTreeNode,
    renderExtraFooter,
    ...rest
  } = propsWithDefaults;
  const {
    trigger,
    root,
    target,
    overlay,
    list,
    searchInput,
    treeView
  } = usePickerRef(ref);
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
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  const activeNode = getTreeActiveNode(flattenedNodes, value, valueKey);
  const {
    register,
    focusFirstNode,
    focusActiveNode
  } = useTreeImperativeHandle();
  const {
    active,
    focusItemValue,
    setFocusItemValue,
    triggerProps
  } = useFocusState({
    focusActiveNode,
    target,
    value,
    onEnter,
    onExit,
    onEntered
  });
  const handleSelect = useEventCallback((treeNode, value, event) => {
    var _target$current, _trigger$current, _trigger$current$clos;
    onSelect === null || onSelect === void 0 || onSelect(treeNode, value, event);

    // Only leaf nodes can update the value and close the picker.
    if (onlyLeafSelectable && !isLeafNode(treeNode)) {
      return;
    }
    setFocusItemValue(value);
    handleChange(value, event);
    (_target$current = target.current) === null || _target$current === void 0 || _target$current.focus();
    (_trigger$current = trigger.current) === null || _trigger$current === void 0 || (_trigger$current$clos = _trigger$current.close) === null || _trigger$current$clos === void 0 || _trigger$current$clos.call(_trigger$current);
  });
  const handleClean = useEventCallback(event => {
    const target = event.target;
    // exclude searchbox
    if (target.matches('input[role="searchbox"]') || disabled || !cleanable) {
      return;
    }
    setValue(null);
    onChange === null || onChange === void 0 || onChange(null, event);
  });
  const handleTreePressEnter = useEventCallback(event => {
    if (isNil(focusItemValue)) {
      return;
    }
    const activeItem = getActiveItem(focusItemValue, flattenedNodes, valueKey);
    handleSelect(activeItem, focusItemValue, event);
  });
  const handleTreeKeyDown = useEventCallback(event => {
    onMenuKeyDown(event, {
      del: handleClean,
      down: () => focusFirstNode(),
      enter: handleTreePressEnter
    });
  });
  const onPickerKeydown = useToggleKeyDownEvent({
    toggle: !activeNode || !active,
    trigger,
    target,
    overlay,
    searchInput,
    active,
    onExit: handleClean,
    onMenuKeyDown: handleTreeKeyDown,
    ...rest
  });
  const handleChange = useEventCallback((nextValue, event) => {
    setValue(nextValue);
    onChange === null || onChange === void 0 || onChange(nextValue, event);
  });
  const treeContext = useMemo(() => ({
    register,
    props: {
      labelKey,
      valueKey,
      childrenKey,
      virtualized,
      renderTreeIcon,
      renderTreeNode
    }
  }), [childrenKey, labelKey, valueKey, virtualized, register, renderTreeIcon, renderTreeNode]);
  const tree = /*#__PURE__*/React.createElement(TreeProvider, {
    value: treeContext
  }, /*#__PURE__*/React.createElement(TreeView, {
    ref: treeView,
    value: value,
    data: treeData,
    disabledItemValues: disabledItemValues,
    expandItemValues: expandItemValues,
    showIndentLine: showIndentLine,
    searchable: searchable,
    searchKeyword: searchKeyword,
    searchBy: searchBy,
    searchInputRef: searchInput,
    loadingNodeValues: loadingNodeValues,
    flattenedNodes: flattenedNodes,
    listProps: listProps,
    listRef: list,
    locale: locale,
    height: treeHeight,
    onExpand: handleExpandTreeNode,
    onSearch: onSearch,
    onSelect: handleSelect,
    onSelectItem: onSelectItem,
    onFocusItem: setFocusItemValue
  }));
  const renderTreeView = (positionProps, speakerRef) => {
    const {
      className
    } = positionProps;
    const classes = merge(className, popupClassName, prefix('tree-menu'));
    return /*#__PURE__*/React.createElement(PickerPopup, {
      autoWidth: popupAutoWidth,
      className: classes,
      style: popupStyle,
      ref: mergeRefs(overlay, speakerRef),
      onKeyDown: onPickerKeydown,
      target: trigger
    }, renderTree ? renderTree(tree) : tree, renderExtraFooter === null || renderExtraFooter === void 0 ? void 0 : renderExtraFooter());
  };

  /**
   * 1.Have a value and the value is valid.
   * 2.Regardless of whether the value is valid, as long as renderValue is set, it is judged to have a value.
   */
  let hasValidValue = !isNil(activeNode) || !isNil(value) && isFunction(renderValue);
  let selectedElement = placeholder;
  if (hasValidValue) {
    const node = activeNode !== null && activeNode !== void 0 ? activeNode : {};
    selectedElement = node[labelKey];
    if (isFunction(renderValue) && value) {
      selectedElement = renderValue(value, node, selectedElement);
      if (isNil(selectedElement)) {
        hasValidValue = false;
      }
    }
  }
  return /*#__PURE__*/React.createElement(PickerToggleTrigger, {
    as: as,
    id: id,
    pickerType: "tree",
    block: block,
    disabled: disabled,
    appearance: appearance,
    popupType: "tree",
    triggerProps: {
      ...pick(props, triggerPropKeys),
      ...triggerProps
    },
    ref: trigger,
    placement: placement,
    speaker: renderTreeView,
    rootRef: root,
    style: style,
    classPrefix: classPrefix,
    className: className
  }, /*#__PURE__*/React.createElement(PickerToggle, _extends({
    ref: target,
    appearance: appearance,
    onKeyDown: onPickerKeydown,
    onClean: createChainedFunction(handleClean, onClean),
    cleanable: cleanable && !disabled,
    as: toggleAs,
    disabled: disabled,
    hasValue: hasValidValue,
    active: active,
    placement: placement,
    inputValue: value,
    focusItemValue: focusItemValue
  }, rest), selectedElement || (locale === null || locale === void 0 ? void 0 : locale.placeholder)));
});
TreePicker.displayName = 'TreePicker';
export default TreePicker;