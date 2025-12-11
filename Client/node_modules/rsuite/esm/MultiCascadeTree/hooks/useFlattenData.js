'use client';
import { useState, useCallback, useEffect } from 'react';
import { UNSAFE_flattenTree } from "../../Tree/utils/index.js";
import { attachParent } from "../../internals/utils/index.js";
/**
 * A hook to flatten tree structure data
 */
function useFlattenData(data, itemKeys) {
  const {
    childrenKey
  } = itemKeys;
  const [flattenData, setFlattenData] = useState(UNSAFE_flattenTree(data, itemKeys.childrenKey));
  const addFlattenData = useCallback((children, parent) => {
    const nodes = children.map(child => {
      return attachParent(child, parent);
    });
    parent[childrenKey] = nodes;
    setFlattenData([...flattenData, ...nodes]);
  }, [childrenKey, flattenData]);
  useEffect(() => {
    setFlattenData(UNSAFE_flattenTree(data, itemKeys.childrenKey));
  }, [data, itemKeys.childrenKey]);
  return {
    addFlattenData,
    flattenData
  };
}
export default useFlattenData;