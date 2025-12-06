import React from 'react';
import type { IconProps } from '@rsuite/icons/Icon';
import type { BoxProps } from '../internals/Box';
import type { HTMLPropsWithoutSelect } from '../internals/types';
import type { DeprecatedDropdownItemProps } from './types';
interface DeprecatedDropdownMenuItemProps extends DeprecatedDropdownItemProps {
    /**
     * Whether to display the divider
     *
     * @deprecated Use dedicated <Dropdown.Separator> component instead
     */
    divider?: boolean;
}
export interface DropdownMenuItemProps<T = any> extends BoxProps, DeprecatedDropdownMenuItemProps, HTMLPropsWithoutSelect {
    /** Active the current option */
    active?: boolean;
    /** Disable the current option */
    disabled?: boolean;
    /** The description of the current option */
    description?: React.ReactNode;
    /** The value of the current option */
    eventKey?: T;
    /** Displays a custom panel */
    panel?: boolean;
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /** The submenu that this menuitem controls (if exists) */
    submenu?: React.ReactElement;
    /**
     * The dropdown item keyboard shortcut.
     *
     * @version 5.58.0
     */
    shortcut?: React.ReactNode;
    /**
     * Select the callback function for the current option
     */
    onSelect?: (eventKey: T, event: React.SyntheticEvent) => void;
}
/**
 * The `<Dropdown.Item>` API
 * - When used inside `<Sidenav>`, renders a `<TreeviewItem>`
 * - Otherwise renders a `<MenuItem>`
 */
declare const DropdownItem: import("../internals/types").InternalRefForwardingComponent<"li", DropdownMenuItemProps<any>, never> & Record<string, never>;
export default DropdownItem;
