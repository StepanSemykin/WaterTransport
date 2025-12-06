import React from 'react';
import { type ListHandle } from '../internals/Windowing';
import type { DataProps, ToArray, WithAsPropsWithoutChildren } from '../internals/types';
import type { TreeNode, TreeNodeMap } from '../internals/Tree/types';
import type { TreeViewBaseProps, TreeDragProps } from './types';
export interface TreeViewProps<V = number | string | null> extends TreeViewBaseProps<V, TreeNode>, DataProps<TreeNode> {
    /**
     * Selected value.
     */
    value?: V;
    /**
     * Whether display search input box.
     */
    searchable?: boolean;
    /**
     * Disabled tree node.
     */
    disabledItemValues?: ToArray<NonNullable<V>>;
    /**
     * Virtualized list ref object.
     */
    listRef?: React.RefObject<ListHandle | null>;
    /**
     * Searchbox input ref object.
     */
    searchInputRef?: React.RefObject<HTMLInputElement | null>;
    /**
     * Called when scrolling.
     */
    onScroll?: (event: React.SyntheticEvent) => void;
}
export type WithTreeDragProps<P> = P & TreeDragProps;
/**
 * Props for the TreeViewInner component.
 */
/**
 * Represents the props for the TreeView component.
 */
interface TreeViewInnerProps<V = string | number | null> extends Omit<WithTreeDragProps<TreeViewProps<V>>, 'onExpand'>, WithAsPropsWithoutChildren {
    /**
     * An array of values representing the loading nodes.
     */
    loadingNodeValues?: V[];
    /**
     * A collection of localized strings.
     */
    locale?: Record<string, string>;
    /**
     * A map of flattened nodes.
     */
    flattenedNodes?: TreeNodeMap;
    /**
     * A callback function that is called when an item in the tree receives focus.
     *
     * @param value - The value of the focused item.
     */
    onFocusItem?: (value?: V) => void;
    /**
     * A callback function that is called when a node is expanded.
     *
     * @param nodeData - The data of the expanded node.
     */
    onExpand?: (nodeData: TreeNode, expanded?: boolean) => void;
}
declare const TreeView: import("../internals/types").InternalRefForwardingComponent<"div", TreeViewInnerProps<string | number | null>, never> & Record<string, never>;
export default TreeView;
