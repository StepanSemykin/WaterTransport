'use client';
import { useEffect } from 'react';
import isFunction from 'lodash/isFunction';
import { useControlled, useEventCallback } from "../../internals/hooks/index.js";
import { createConcatChildrenFunction } from "../../internals/Picker/index.js";
import { getExpandItemValues, flattenTree } from "../utils/index.js";
export function getDefaultExpandItemValues(data, options) {
  const {
    valueKey,
    defaultExpandAll,
    childrenKey,
    defaultExpandItemValues = []
  } = options;
  if (defaultExpandAll) {
    return flattenTree(data, item => item[childrenKey] || []).filter(item => Array.isArray(item[childrenKey]) && item[childrenKey].length > 0).map(item => item[valueKey]);
  }
  return defaultExpandItemValues;
}
/**
 * Custom hook for managing tree expansion state.
 */
function useExpandTree(data, props) {
  const {
    defaultExpandAll,
    valueKey,
    childrenKey,
    defaultExpandItemValues,
    controlledExpandItemValues,
    onExpand,
    getChildren,
    appendChild
  } = props;
  const [expandItemValues, setExpandItemValues] = useControlled(controlledExpandItemValues, getDefaultExpandItemValues(data, {
    defaultExpandAll,
    valueKey,
    childrenKey,
    defaultExpandItemValues
  }));
  useEffect(() => {
    if (Array.isArray(controlledExpandItemValues)) {
      setExpandItemValues(controlledExpandItemValues);
    }
  }, [controlledExpandItemValues, setExpandItemValues]);
  const handleExpandTreeNode = useEventCallback((node, expanded) => {
    const nextExpandItemValues = getExpandItemValues({
      node,
      isExpand: !expanded,
      expandItemValues,
      valueKey
    });
    setExpandItemValues(nextExpandItemValues);
    onExpand === null || onExpand === void 0 || onExpand(nextExpandItemValues, node, createConcatChildrenFunction(node, node[valueKey], {
      valueKey,
      childrenKey
    }));
    if (isFunction(getChildren) && !node.expand && Array.isArray(node[childrenKey]) && node[childrenKey].length === 0) {
      appendChild(node, getChildren);
    }
  });
  return {
    expandItemValues,
    handleExpandTreeNode
  };
}
export default useExpandTree;