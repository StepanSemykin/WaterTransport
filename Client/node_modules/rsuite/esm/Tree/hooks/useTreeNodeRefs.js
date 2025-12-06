'use client';
import { useRef } from 'react';
import isNil from 'lodash/isNil';

/**
 * Custom hook that manages references to tree nodes. */
export default function useTreeNodeRefs() {
  const treeNodeRefs = useRef({});
  const saveTreeNodeRef = (ref, refKey) => {
    if (!isNil(refKey)) {
      treeNodeRefs.current[refKey] = ref;
    }
  };
  return {
    treeNodesRefs: treeNodeRefs.current,
    saveTreeNodeRef
  };
}