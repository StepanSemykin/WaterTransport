'use client';
/**
 * Returns an array indicating the hierarchy path from root towards `target` item
 */
export function getPathTowardsItem(target, getParent) {
  if (!target) return [];
  const path = [target];
  for (let parent = getParent(target); parent; parent = getParent(parent)) {
    path.unshift(parent);
  }
  return path;
}