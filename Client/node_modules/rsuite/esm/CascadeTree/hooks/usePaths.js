'use client';
import { useMemo } from 'react';
import { getPathTowardsItem } from "../../internals/Tree/utils/index.js";
import { getColumnsAndPaths } from "../utils.js";
/**
 * A Hook to get the selected path of Tree.
 *
 * - The columns of items to be displayed
 * - The path towards the current focused item
 * - The path towards the current selected item (referred to by Cascader's value)
 *
 */
export function usePaths({
  data,
  activeItem,
  selectedItem,
  getParent,
  getChildren
}) {
  const pathTowardsSelectedItem = useMemo(() => getPathTowardsItem(selectedItem, getParent), [getParent, selectedItem]);
  const {
    columns,
    path: pathTowardsActiveItem
  } = useMemo(() => getColumnsAndPaths(data, activeItem, {
    getParent,
    getChildren
  }), [data, activeItem, getParent, getChildren]);
  return {
    columns,
    pathTowardsSelectedItem,
    pathTowardsActiveItem
  };
}
export default usePaths;