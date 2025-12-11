import React from 'react';
import { BaseBoxProps } from '../internals/Box';
import type { HTMLPropsWithoutSelect } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
/**
 * Props of SidenavItem component
 */
export interface SidenavItemProps<T = any> extends BaseBoxProps, HTMLPropsWithoutSelect {
    /**
     * Whether the item is activated
     */
    active?: boolean;
    /**
     * The icon displayed next to the item
     */
    icon?: React.ReactElement<IconProps>;
    /**
     * Disable the item
     */
    disabled?: boolean;
    /**
     * The value of the item that is used to identify the item
     */
    eventKey?: T;
    /**
     * Render a divider
     */
    divider?: boolean;
    /**
     * Render a panel
     */
    panel?: boolean;
    /**
     * The content of the tooltip
     */
    tooltip?: React.ReactNode;
    /**
     * The callback function when the item is selected
     */
    onSelect?: (eventKey: T, event: React.MouseEvent) => void;
}
/**
 * @private
 */
declare const SidenavItem: import("../internals/types").InternalRefForwardingComponent<"li", SidenavItemProps<any>, never> & Record<string, never>;
export default SidenavItem;
