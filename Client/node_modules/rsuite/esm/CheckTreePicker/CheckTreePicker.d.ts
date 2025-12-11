import React from 'react';
import { type CheckTreeViewProps } from '../CheckTree/CheckTreeView';
import { PickerLocale } from '../locales';
import { PickerToggleProps } from '../internals/Picker';
import type { TreeNode } from '../internals/Tree/types';
import type { FormControlPickerProps, Option, DeprecatedMenuProps } from '../internals/types';
import type { TreeExtraProps } from '../Tree/types';
export type ValueType = (string | number)[];
export interface CheckTreePickerProps<V = ValueType> extends Omit<CheckTreeViewProps<V>, 'value' | 'onChange' | 'data'>, TreeExtraProps, DeprecatedMenuProps, FormControlPickerProps<V, PickerLocale, Option>, Pick<PickerToggleProps, 'caretAs' | 'loading'> {
    /**
     * A picker that can be counted
     */
    countable?: boolean;
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
     * Custom render selected items
     */
    renderValue?: (value: V, selectedNodes: TreeNode[], selectedElement: React.ReactNode) => React.ReactNode;
    /**
     * In the cascade case, the leaf node's value change callbacks
     */
    onCascadeChange?: (v: ValueType, event: React.SyntheticEvent) => void;
}
/**
 * The `CheckTreePicker` component is used for selecting multiple options which are organized in a tree structure.
 *
 * @see https://rsuitejs.com/components/check-tree-picker
 */
declare const CheckTreePicker: import("../internals/types").InternalRefForwardingComponent<"div", CheckTreePickerProps<ValueType>, never> & Record<string, never>;
export default CheckTreePicker;
