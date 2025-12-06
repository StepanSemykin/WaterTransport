'use client';
import _groupBy from "lodash/groupBy";
import { WalkTreeStrategy, flattenTree } from "../../Tree/utils/index.js";
import { RSUITE_PICKER_GROUP_KEY } from "../symbols.js";
export const KEY_GROUP_TITLE = 'groupTitle';
export function getDataGroupBy(data, key, sort) {
  const groupMap = _groupBy(data, key);
  const isSort = typeof sort === 'function';
  const groups = Object.entries(groupMap).map(([groupTitle, children]) => ({
    children: isSort ? children.sort(sort(false)) : children,
    [KEY_GROUP_TITLE]: groupTitle,
    [RSUITE_PICKER_GROUP_KEY]: true
  }));
  if (isSort) {
    groups.sort(sort(true));
  }

  // Use DFS traverse
  // Because I want the result to be [group, child, child, group, child, child]
  // rather than [group, group, child, child, child, child]
  return flattenTree(groups, group => group.children, WalkTreeStrategy.DFS);
}
export default getDataGroupBy;