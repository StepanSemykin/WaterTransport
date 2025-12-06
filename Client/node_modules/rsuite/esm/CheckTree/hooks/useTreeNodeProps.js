'use client';
import React, { useCallback } from 'react';
import { isAllSiblingNodeUncheckable, getDisabledState, isNodeUncheckable } from "../utils.js";
import { useItemDataKeys } from "../../internals/Tree/TreeProvider.js";
import Highlight from "../../Highlight/index.js";
function useTreeNodeProps(props) {
  const {
    valueKey,
    labelKey
  } = useItemDataKeys();
  const {
    uncheckableItemValues,
    disabledItemValues,
    loadingNodeValues,
    focusItemValue,
    flattenedNodes,
    keyword
  } = props;
  return useCallback(nodeData => {
    const {
      visible,
      checkState
    } = nodeData;
    const value = nodeData[valueKey];
    const nodeLabel = nodeData[labelKey];
    const allUncheckable = isAllSiblingNodeUncheckable(nodeData, flattenedNodes, uncheckableItemValues, valueKey);
    const label = keyword ? /*#__PURE__*/React.createElement(Highlight, {
      as: "span",
      query: keyword
    }, nodeLabel) : nodeLabel;
    const disabled = getDisabledState(flattenedNodes, nodeData, {
      disabledItemValues,
      valueKey
    });
    const uncheckable = isNodeUncheckable(nodeData, {
      uncheckableItemValues,
      valueKey
    });
    const loading = loadingNodeValues.some(item => item === nodeData[valueKey]);
    const focus = focusItemValue === value;
    return {
      value,
      label,
      visible,
      loading,
      disabled,
      nodeData,
      checkState,
      uncheckable,
      allUncheckable,
      focus
    };
  }, [valueKey, flattenedNodes, uncheckableItemValues, keyword, labelKey, disabledItemValues, loadingNodeValues, focusItemValue]);
}
export default useTreeNodeProps;