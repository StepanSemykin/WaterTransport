'use client';
import { useState } from 'react';
import useFlattenData from "./useFlattenData.js";
import useColumnData from "./useColumnData.js";
import { useEventCallback, useUpdateEffect, useIsMounted } from "../../internals/hooks/index.js";
const useSelect = props => {
  const {
    data,
    childrenKey,
    labelKey,
    valueKey,
    onSelect,
    getChildren
  } = props;
  const itemKeys = {
    childrenKey,
    labelKey,
    valueKey
  };
  const {
    flattenData,
    addFlattenData
  } = useFlattenData(data, itemKeys);

  // The columns displayed in the cascading panel.
  const {
    columnData,
    addColumn,
    setColumnData,
    removeColumnByIndex,
    enforceUpdateColumnData
  } = useColumnData(flattenData);
  useUpdateEffect(() => {
    enforceUpdateColumnData(data);
  }, [data]);
  const isMounted = useIsMounted();

  // The path after cascading data selection.
  const [selectedPaths, setSelectedPaths] = useState();
  const handleSelect = useEventCallback((node, cascadePaths, event) => {
    var _node$childrenKey, _node$childrenKey2;
    setSelectedPaths(cascadePaths);
    const columnIndex = cascadePaths.length;

    // Lazy load node's children
    if (typeof getChildren === 'function' && ((_node$childrenKey = node[childrenKey]) === null || _node$childrenKey === void 0 ? void 0 : _node$childrenKey.length) === 0) {
      node.loading = true;
      const children = getChildren(node);
      if (children instanceof Promise) {
        children.then(data => {
          node.loading = false;
          node[childrenKey] = data;
          if (isMounted()) {
            addFlattenData(data, node);
            addColumn(data, columnIndex);
          }
        });
      } else {
        node.loading = false;
        node[childrenKey] = children;
        addFlattenData(children, node);
        addColumn(children, columnIndex);
      }
    } else if ((_node$childrenKey2 = node[childrenKey]) !== null && _node$childrenKey2 !== void 0 && _node$childrenKey2.length) {
      addColumn(node[childrenKey], columnIndex);
    } else {
      // Removes subsequent columns of the current column when the clicked node is a leaf node.
      removeColumnByIndex(columnIndex);
    }
    onSelect === null || onSelect === void 0 || onSelect(node, cascadePaths, event);
  });
  return {
    columnData,
    setColumnData,
    flattenData,
    selectedPaths,
    setSelectedPaths,
    handleSelect
  };
};
export default useSelect;