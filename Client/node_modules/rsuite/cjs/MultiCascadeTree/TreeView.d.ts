import React from 'react';
import type { Option, WithAsProps } from '../internals/types';
import type { CascadeColumn } from '../CascadeTree/types';
export interface TreeViewProps<T = any> extends WithAsProps {
    disabledItemValues?: T[];
    value: T[];
    childrenKey: string;
    valueKey: string;
    labelKey: string;
    columnWidth?: number;
    columnHeight?: number | string;
    cascade?: boolean;
    cascadeData: (readonly Option<T>[])[];
    cascadePaths?: Option<T>[];
    uncheckableItemValues: T[];
    renderTreeNode?: (node: React.ReactNode, item: Option<T>) => React.ReactNode;
    renderColumn?: (childNodes: React.ReactNode, column: CascadeColumn<T>) => React.ReactNode;
    onCheck?: (node: Option<T>, event: React.SyntheticEvent, checked: boolean) => void;
    onSelect?: (node: Option<T>, cascadePaths: Option<T>[], event: React.SyntheticEvent) => void;
}
declare const TreeView: import("../internals/types").InternalRefForwardingComponent<"div", TreeViewProps<any>, never> & Record<string, never>;
export default TreeView;
