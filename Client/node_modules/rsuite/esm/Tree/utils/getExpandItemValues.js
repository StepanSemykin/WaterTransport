'use client';
/**
 * Returns an array of expanded item values.
 */
export function getExpandItemValues({
  node,
  isExpand,
  expandItemValues,
  valueKey
}) {
  const newExpandItemValues = new Set(expandItemValues);
  if (isExpand) {
    newExpandItemValues.add(node[valueKey]);
  } else {
    newExpandItemValues.delete(node[valueKey]);
  }
  return Array.from(newExpandItemValues);
}