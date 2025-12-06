'use client';
import React, { useCallback } from 'react';
import { TREE_NODE_DROP_POSITION } from "../../internals/constants/index.js";
import { shallowEqual as equal } from "../../internals/utils/index.js";
import { useCombobox } from "../../internals/Picker/hooks/index.js";
import { useItemDataKeys } from "../../internals/Tree/TreeProvider.js";
import Highlight from "../../Highlight/index.js";
function useTreeNodeProps(props) {
  const {
    valueKey,
    labelKey,
    childrenKey
  } = useItemDataKeys();
  const {
    id
  } = useCombobox();
  const {
    value,
    disabledItemValues,
    loadingNodeValues,
    focusItemValue,
    keyword,
    dragNode,
    dragOverNodeKey,
    dropNodePosition
  } = props;
  return useCallback((nodeData, layer, index) => {
    const {
      DRAG_OVER,
      DRAG_OVER_TOP,
      DRAG_OVER_BOTTOM
    } = TREE_NODE_DROP_POSITION;
    const {
      visible
    } = nodeData;
    const draggingNode = dragNode !== null && dragNode !== void 0 ? dragNode : {};
    const nodeValue = nodeData[valueKey];
    const nodeLabel = nodeData[labelKey];
    const children = nodeData[childrenKey];
    const label = keyword ? /*#__PURE__*/React.createElement(Highlight, {
      as: "span",
      query: keyword
    }, nodeLabel) : nodeLabel;
    const dragging = equal(nodeValue, draggingNode[valueKey]);
    let dragStatus;
    if (equal(nodeValue, dragOverNodeKey)) {
      switch (dropNodePosition) {
        case DRAG_OVER:
          dragStatus = 'drag-over';
          break;
        case DRAG_OVER_TOP:
          dragStatus = 'drag-over-top';
          break;
        case DRAG_OVER_BOTTOM:
          dragStatus = 'drag-over-bottom';
          break;
      }
    }
    const disabled = disabledItemValues.some(disabledItem => equal(disabledItem, nodeValue));
    const loading = loadingNodeValues.some(item => equal(item, nodeValue));
    const active = equal(nodeValue, value);
    const focus = equal(nodeValue, focusItemValue);
    return {
      id: id ? `${id}-opt-${nodeValue}` : undefined,
      value: nodeValue,
      label,
      index,
      layer,
      loading,
      active,
      focus,
      visible,
      children,
      nodeData,
      disabled,
      dragging,
      dragStatus
    };
  }, [childrenKey, disabledItemValues, dragNode, dragOverNodeKey, dropNodePosition, focusItemValue, id, keyword, labelKey, loadingNodeValues, value, valueKey]);
}
export default useTreeNodeProps;