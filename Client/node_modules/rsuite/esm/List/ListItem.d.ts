import React from 'react';
import { BaseBoxProps } from '../internals/Box';
import { Collection } from './helper/useManager';
export interface ListItemProps extends BaseBoxProps, React.HTMLAttributes<HTMLElement> {
    index?: number;
    collection?: Collection;
    disabled?: boolean;
    size?: 'lg' | 'md' | 'sm' | 'xs';
}
/**
 * The `List.Item` component is used to specify the layout of the list item.
 * @see https://rsuitejs.com/components/list
 */
declare const ListItem: import("../internals/types").InternalRefForwardingComponent<"div", ListItemProps, never> & Record<string, never>;
export default ListItem;
