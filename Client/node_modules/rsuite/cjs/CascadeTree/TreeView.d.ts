import React from 'react';
import type { Option, WithAsProps, DataProps, ToArray } from '../internals/types';
import type { SelectNode, CascadeColumn } from './types';
type SetLike<T = unknown> = {
    has(value: T): boolean;
};
export interface TreeViewProps<T = any> extends WithAsProps, Omit<DataProps<Option<T>>, 'data'> {
    data?: (readonly Option<T>[])[];
    disabledItemValues?: ToArray<NonNullable<T>>;
    activeItemValue?: T | null;
    loadingItemsSet?: SetLike<Option<T>>;
    cascadePaths?: Option<T>[];
    columnWidth?: number;
    columnHeight?: number | string;
    renderTreeNode?: (node: React.ReactNode, itemData: Option<T>) => React.ReactNode;
    renderColumn?: (childNodes: React.ReactNode, column: CascadeColumn<T>) => React.ReactNode;
    onSelect?: (node: SelectNode<T>, event: React.MouseEvent) => void;
}
declare const TreeView: import("../internals/types").InternalRefForwardingComponent<"div", TreeViewProps<any>, never> & Record<string, never>;
export default TreeView;
