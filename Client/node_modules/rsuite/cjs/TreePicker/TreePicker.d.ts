import React from 'react';
import { TreeViewProps } from '../Tree/TreeView';
import { PickerLocale } from '../locales';
import { PickerToggleProps } from '../internals/Picker';
import { TreeNode } from '../internals/Tree/types';
import type { FormControlPickerProps, DeprecatedMenuProps } from '../internals/types';
import type { TreeExtraProps } from '../Tree/types';
export interface TreePickerProps<V = number | string | null> extends TreeViewProps<V>, TreeExtraProps, DeprecatedMenuProps, FormControlPickerProps<V, PickerLocale, TreeNode>, Pick<PickerToggleProps, 'caretAs' | 'loading'> {
    /**
     * Custom render selected items
     */
    renderValue?: (value: V, selectedNode: TreeNode, selectedElement: React.ReactNode) => React.ReactNode;
    /**
     * The height of the tree
     */
    treeHeight?: number;
    /**
     * Popup auto width
     *
     * @default true
     */
    popupAutoWidth?: boolean;
    /**
     * Whether only leaf nodes can be selected
     *
     * @default false
     */
    onlyLeafSelectable?: boolean;
}
/**
 * The `TreePicker` component is used for selecting single options which are organized in a tree structure.
 *
 * @see https://rsuitejs.com/components/tree-picker/
 */
declare const TreePicker: import("../internals/types").InternalRefForwardingComponent<"div", TreePickerProps<string | number | null>, never> & Record<string, never>;
export default TreePicker;
