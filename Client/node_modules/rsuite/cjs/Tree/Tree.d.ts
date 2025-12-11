import React from 'react';
import { TreeViewProps } from './TreeView';
import type { TreeExtraProps, WithTreeDragProps } from './types';
export interface TreeProps<T = string | number | null> extends WithTreeDragProps<TreeViewProps<T>>, TreeExtraProps {
    /**
     * Default selected Value
     */
    defaultValue?: T;
    /**
     * The shadow of the content when scrolling
     */
    scrollShadow?: boolean;
    /**
     * Callback function called after the value has been changed.
     * @param value - The new value.
     * @param event - The event object.
     */
    onChange?: (value: T, event: React.SyntheticEvent) => void;
}
/**
 * The `Tree` component is used to display hierarchical data.
 *
 * @see https://rsuitejs.com/components/tree
 */
declare const Tree: import("../internals/types").InternalRefForwardingComponent<"div", TreeProps<string | number | null>, never> & Record<string, never>;
export default Tree;
