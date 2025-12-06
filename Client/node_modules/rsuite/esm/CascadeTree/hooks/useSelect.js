'use client';
import { useState } from 'react';
import { useSet } from 'react-use-set';
import { useEventCallback, useIsMounted } from "../../internals/hooks/index.js";
import { shallowEqual } from "../../internals/utils/index.js";
/**
 * Hook for handling the state after the option is selected
 */
const useSelect = props => {
  const {
    value,
    onSelect,
    getChildren,
    valueKey,
    onChange,
    childrenKey,
    selectedItem,
    childrenMap
  } = props;

  // The item that focus is on
  const [activeItem, setActiveItem] = useState(selectedItem);
  const isMounted = useIsMounted();
  const loadingItemsSet = useSet();
  const handleSelect = useEventCallback((node, event) => {
    var _itemData$childrenKey;
    const {
      itemData,
      isLeafNode
    } = node;
    setActiveItem(itemData);

    // Lazy load node's children
    if (typeof getChildren === 'function' && ((_itemData$childrenKey = itemData[childrenKey]) === null || _itemData$childrenKey === void 0 ? void 0 : _itemData$childrenKey.length) === 0 && !childrenMap.has(itemData)) {
      loadingItemsSet.add(itemData);
      const children = getChildren(itemData);
      if (children instanceof Promise) {
        children.then(data => {
          if (isMounted()) {
            loadingItemsSet.delete(itemData);
            childrenMap.set(itemData, data);
          }
        });
      } else {
        loadingItemsSet.delete(itemData);
        childrenMap.set(itemData, children);
      }
    }
    if (isLeafNode) {
      const nextValue = itemData[valueKey];
      if (!shallowEqual(value, nextValue)) {
        onChange === null || onChange === void 0 || onChange(nextValue, event);
      }
    }
    onSelect === null || onSelect === void 0 || onSelect(node, event);
  });
  return {
    loadingItemsSet,
    activeItem,
    setActiveItem,
    handleSelect
  };
};
export default useSelect;