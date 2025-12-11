import React from 'react';
import { BaseBoxProps } from '../Box';
interface TreeViewProps extends BaseBoxProps, React.HTMLAttributes<HTMLDivElement> {
    treeRootClassName: string;
    multiselectable?: boolean;
    height?: number;
}
declare const TreeView: import("../types").InternalRefForwardingComponent<"div", TreeViewProps, never> & Record<string, never>;
export default TreeView;
