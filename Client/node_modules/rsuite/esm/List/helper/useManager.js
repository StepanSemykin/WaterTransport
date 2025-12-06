'use client';
import _flatten from "lodash/flatten";
import { useCallback, useRef } from 'react';
const useManager = () => {
  const collectionMapRef = useRef({});
  const listItemRegister = useCallback(item => {
    const collection = item.info.collection;
    if (!Array.isArray(collectionMapRef.current[collection])) {
      // reset collection
      collectionMapRef.current[collection] = [];
    }
    collectionMapRef.current[collection].push(item);
    return {
      unregister: () => {
        const index = collectionMapRef.current[collection].indexOf(item);
        if (index !== -1) {
          collectionMapRef.current[collection].splice(index, 1);
        }
      }
    };
  }, []);
  const getManagedItem = useCallback(node => {
    const allItems = _flatten(Object.values(collectionMapRef.current));
    return allItems.find(managerRef => managerRef.node === node);
  }, []);
  const getOrderedItems = useCallback(collection => {
    return collection != null ? [...collectionMapRef.current[collection]].sort((nodeInfo1, nodeInfo2) => Number(nodeInfo1.info.index) - Number(nodeInfo2.info.index)) : [];
  }, []);
  return {
    listItemRegister,
    getManagedItem,
    getOrderedItems
  };
};
export default useManager;