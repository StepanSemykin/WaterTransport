import React from 'react';
import type { WithAsProps, HTMLPropsWithoutSelect } from '../types';
export interface ListItemProps extends WithAsProps, HTMLPropsWithoutSelect {
    active?: boolean;
    disabled?: boolean;
    value?: string | number;
    focus?: boolean;
    title?: string;
    onSelect?: (value: any, event: React.MouseEvent) => void;
    onKeyDown?: (event: React.KeyboardEvent) => void;
    renderItem?: (value: any) => React.ReactNode;
}
declare const ListItem: import("../types").InternalRefForwardingComponent<"div", ListItemProps, never> & Record<string, never>;
export default ListItem;
