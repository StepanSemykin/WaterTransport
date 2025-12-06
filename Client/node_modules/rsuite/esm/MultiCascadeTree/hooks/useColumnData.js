'use client';
import { useState } from 'react';
import slice from 'lodash/slice';
import { UNSAFE_flattenTree } from "../../Tree/utils/index.js";
/**
 * A hook for column data
 * @param flattenData
 */
function useColumnData(flattenData) {
  // The columns displayed in the cascading panel.
  const [columnData, setColumnData] = useState([flattenData.filter(item => !item.parent)]);

  /**
   * Add a list of options to the cascading panel. Used for lazy loading options.
   * @param column
   * @param index The index of the current column.
   */
  function addColumn(column, index) {
    setColumnData([...slice(columnData, 0, index), column]);
  }

  /**
   * Remove subsequent columns of the specified column
   * @param index
   */
  function removeColumnByIndex(index) {
    setColumnData([...slice(columnData, 0, index)]);
  }
  function enforceUpdateColumnData(nextData) {
    const nextFlattenData = UNSAFE_flattenTree(nextData);
    setColumnData([nextFlattenData.filter(item => !item.parent)]);
  }
  return {
    columnData,
    addColumn,
    removeColumnByIndex,
    setColumnData,
    enforceUpdateColumnData
  };
}
export default useColumnData;