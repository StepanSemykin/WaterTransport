'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import SpinnerIcon from '@rsuite/icons/Spinner';
import ArrowLeftLineIcon from '@rsuite/icons/ArrowLeftLine';
import ArrowRightLineIcon from '@rsuite/icons/ArrowRightLine';
import { useStyles, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, shallowEqual, mergeStyles } from "../internals/utils/index.js";
import { ListCheckItem, useCombobox } from "../internals/Picker/index.js";
import { isSomeParentChecked, isSomeChildChecked } from "./utils.js";
const emptyArray = [];
const TreeView = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    classPrefix = 'tree',
    className,
    cascade,
    cascadeData = emptyArray,
    cascadePaths = emptyArray,
    childrenKey = 'children',
    disabledItemValues = emptyArray,
    columnWidth = 156,
    columnHeight = 200,
    uncheckableItemValues = emptyArray,
    value,
    valueKey = 'value',
    labelKey = 'label',
    style,
    renderTreeNode,
    renderColumn,
    onCheck,
    onSelect,
    ...rest
  } = props;
  const {
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, prefix('items'));
  const {
    rtl
  } = useCustom();
  const {
    id,
    labelId,
    popupType,
    multiple
  } = useCombobox();
  const getCascadePaths = (layer, node) => {
    const paths = [];
    for (let i = 0; i < cascadeData.length && i < layer; i += 1) {
      if (i < layer - 1 && cascadePaths) {
        paths.push(cascadePaths[i]);
      }
    }
    paths.push(node);
    return paths;
  };
  const handleSelect = useEventCallback((layer, node, event) => {
    const cascadePaths = getCascadePaths(layer + 1, node);
    onSelect === null || onSelect === void 0 || onSelect(node, cascadePaths, event);
  });
  const renderCascadeNode = nodeProps => {
    const {
      node,
      index,
      layer,
      focus,
      uncheckable,
      size
    } = nodeProps;
    const children = node[childrenKey];
    const nodeValue = node[valueKey];
    const label = node[labelKey];
    const disabled = disabledItemValues.some(disabledValue => shallowEqual(disabledValue, nodeValue));

    // Use `value` in keys when If `value` is string or number
    const onlyKey = typeof value === 'number' || typeof value === 'string' ? value : index;
    const Icon = node.loading ? SpinnerIcon : rtl ? ArrowLeftLineIcon : ArrowRightLineIcon;
    let active = value.some(v => v === nodeValue);
    if (cascade) {
      active = active || isSomeParentChecked(node, value, {
        valueKey
      });
    }
    return /*#__PURE__*/React.createElement(ListCheckItem, {
      as: "li",
      role: "treeitem",
      "aria-level": layer + 1,
      "aria-setsize": size,
      "aria-posinset": index + 1,
      "aria-label": typeof label === 'string' ? label : undefined,
      key: `${layer}-${onlyKey}`,
      disabled: disabled,
      active: active,
      focus: focus
      // Pass the node as a value to Item, and use it in event callbacks.
      ,
      value: nodeValue,
      className: children ? prefix('has-children') : undefined,
      indeterminate: cascade && !active && isSomeChildChecked(node, value, {
        valueKey,
        childrenKey
      }),
      onSelectItem: (_value, event) => handleSelect(layer, node, event),
      onCheck: (_value, event, checked) => onCheck === null || onCheck === void 0 ? void 0 : onCheck(node, event, checked),
      checkable: !uncheckable,
      labelClickable: false
    }, renderTreeNode ? renderTreeNode(label, node) : label, children ? /*#__PURE__*/React.createElement(Icon, {
      className: prefix('caret'),
      spin: node.loading
    }) : null);
  };
  const columnStyles = {
    height: columnHeight,
    width: columnWidth
  };
  const cascadeNodes = cascadeData.map((children, layer) => {
    let uncheckableCount = 0;
    const onlyKey = `${layer}_${children.length}`;
    const childNodes = /*#__PURE__*/React.createElement(React.Fragment, null, children.map((item, index) => {
      const uncheckable = uncheckableItemValues.some(uncheckableValue => shallowEqual(uncheckableValue, item[valueKey]));
      if (uncheckable) {
        uncheckableCount++;
      }
      const focus = cascadePaths[layer] && shallowEqual(cascadePaths[layer][valueKey], item[valueKey]);
      return renderCascadeNode({
        node: item,
        index,
        layer,
        focus,
        uncheckable,
        size: children.length
      });
    }));
    const parentItem = cascadePaths[layer - 1];
    const columnClasses = prefix('column', {
      'column-uncheckable': uncheckableCount === children.length
    });
    return /*#__PURE__*/React.createElement("ul", {
      role: "group",
      key: onlyKey,
      className: columnClasses,
      "data-layer": layer,
      style: columnStyles
    }, renderColumn ? renderColumn(childNodes, {
      items: children,
      parentItem,
      layer
    }) : childNodes);
  });
  const styles = mergeStyles(style, {
    width: cascadeData.length * columnWidth
  });
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "tree",
    id: id ? `${id}-${popupType}` : undefined,
    "aria-labelledby": labelId,
    "aria-multiselectable": multiple
  }, rest, {
    ref: ref,
    className: classes,
    style: styles
  }), cascadeNodes);
});
TreeView.displayName = 'TreeView';
export default TreeView;