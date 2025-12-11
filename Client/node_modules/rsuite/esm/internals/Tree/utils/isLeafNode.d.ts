/**
 * Checks if a node is a leaf node.
 * @param node  The node to check.
 * @param childrenKey The key of the children property.
 */
export declare function isLeafNode<T extends Record<string, unknown>>(node: T, childrenKey?: string): boolean;
