'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useEffect, useRef } from 'react';
import isUndefined from 'lodash/isUndefined';
import isNil from 'lodash/isNil';
import getPosition from 'dom-lib/getPosition';
import scrollTop from 'dom-lib/scrollTop';
import SpinnerIcon from '@rsuite/icons/Spinner';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import { forwardRef, shallowEqual, mergeRefs, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { ListItem, useCombobox } from "../internals/Picker/index.js";
const emptyArray = [];
const TreeView = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    activeItemValue,
    classPrefix = 'tree',
    className,
    childrenKey = 'children',
    disabledItemValues = emptyArray,
    columnWidth = 140,
    columnHeight = 200,
    valueKey = 'value',
    data = emptyArray,
    cascadePaths = emptyArray,
    loadingItemsSet,
    labelKey = 'label',
    style,
    renderColumn,
    renderTreeNode,
    onSelect,
    ...rest
  } = props;
  const {
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, prefix('items'));
  const rootRef = useRef(null);
  const {
    rtl
  } = useCustom();
  const {
    id,
    labelId,
    popupType
  } = useCombobox();
  useEffect(() => {
    var _rootRef$current;
    const columns = ((_rootRef$current = rootRef.current) === null || _rootRef$current === void 0 ? void 0 : _rootRef$current.querySelectorAll('[data-type="column"]')) || [];
    columns.forEach(column => {
      if (!column) {
        return;
      }
      let activeItem = column.querySelector(`.${prefix('item-focus')}`);
      if (!activeItem) {
        activeItem = column.querySelector(`.${prefix('item-active')}`);
      }
      if (activeItem) {
        const position = getPosition(activeItem, column);
        // Let the active option scroll into view.
        if (position !== null && position !== void 0 && position.top) {
          scrollTop(column, position === null || position === void 0 ? void 0 : position.top);
        }
      }
    });
  }, [prefix]);
  const getCascadePaths = (layer, node) => {
    const paths = [];
    for (let i = 0; i < data.length && i < layer; i += 1) {
      if (i < layer - 1 && cascadePaths) {
        paths.push(cascadePaths[i]);
      }
    }
    paths.push(node);
    return paths;
  };
  const handleSelect = useEventCallback((layer, itemData, event) => {
    const isLeafNode = isNil(itemData[childrenKey]);
    const cascadePaths = getCascadePaths(layer + 1, itemData);
    onSelect === null || onSelect === void 0 || onSelect({
      itemData,
      cascadePaths,
      isLeafNode
    }, event);
  });
  const renderCascadeNode = nodeProps => {
    var _loadingItemsSet$has;
    const {
      itemData,
      index,
      layer,
      focus,
      size
    } = nodeProps;
    const children = itemData[childrenKey];
    const value = itemData[valueKey];
    const label = itemData[labelKey];
    const disabled = disabledItemValues.some(disabledValue => shallowEqual(disabledValue, value));
    const loading = (_loadingItemsSet$has = loadingItemsSet === null || loadingItemsSet === void 0 ? void 0 : loadingItemsSet.has(itemData)) !== null && _loadingItemsSet$has !== void 0 ? _loadingItemsSet$has : false;

    // Use `value` in keys when If `value` is string or number
    const onlyKey = typeof value === 'number' || typeof value === 'string' ? value : index;
    const Icon = loading ? SpinnerIcon : rtl ? ArrowLeftLineIcon : ArrowRightLineIcon;
    return /*#__PURE__*/React.createElement(ListItem, {
      as: 'li',
      role: "treeitem",
      "aria-level": layer + 1,
      "aria-setsize": size,
      "aria-posinset": index + 1,
      "aria-label": typeof label === 'string' ? label : undefined,
      classPrefix: "cascade-tree-item",
      key: `${layer}-${onlyKey}`,
      disabled: disabled,
      active: !isUndefined(activeItemValue) && shallowEqual(activeItemValue, value),
      focus: focus,
      value: value,
      className: children ? prefix('has-children') : undefined,
      onSelect: (_value, event) => handleSelect(layer, itemData, event)
    }, /*#__PURE__*/React.createElement("span", {
      className: prefix('item-label')
    }, renderTreeNode ? renderTreeNode(label, itemData) : label), children ? /*#__PURE__*/React.createElement(Icon, {
      className: prefix('caret'),
      spin: loading,
      "data-testid": "spinner"
    }) : null);
  };
  const cascadeNodes = data.map((children, layer) => {
    const onlyKey = `${layer}_${children.length}`;
    const parentItem = cascadePaths[layer - 1];
    const childNodes = /*#__PURE__*/React.createElement(React.Fragment, null, children.map((itemData, index) => {
      const focus = cascadePaths[layer] && shallowEqual(cascadePaths[layer][valueKey], itemData[valueKey]);
      return renderCascadeNode({
        itemData,
        index,
        layer,
        focus,
        size: children.length
      });
    }));
    return /*#__PURE__*/React.createElement("ul", {
      role: "group",
      "data-layer": layer,
      "data-type": 'column',
      key: onlyKey,
      className: prefix('column'),
      style: {
        height: columnHeight,
        width: columnWidth
      }
    }, renderColumn ? renderColumn(childNodes, {
      items: children,
      parentItem,
      layer
    }) : childNodes);
  });
  const styles = mergeStyles(style, {
    width: data.length * columnWidth
  });
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "tree",
    id: id ? `${id}-${popupType}` : undefined,
    "aria-labelledby": labelId
  }, rest, {
    ref: mergeRefs(rootRef, ref),
    className: classes,
    style: styles
  }), cascadeNodes);
});
TreeView.displayName = 'TreeView';
export default TreeView;