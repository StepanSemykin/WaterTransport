import React from 'react';
import type { BoxProps } from '../internals/Box';
import type { IconProps } from '@rsuite/icons/Icon';
import type { HTMLPropsWithoutSelect } from '../internals/types';
export interface SidenavDropdownItemProps<T = any> extends BoxProps, HTMLPropsWithoutSelect {
    /** Active the current option */
    active?: boolean;
    /** Primary content */
    children?: React.ReactNode;
    /** You can use a custom element for this component */
    as?: React.ElementType;
    /** Whether to display the divider */
    divider?: boolean;
    /** Disable the current option */
    disabled?: boolean;
    /** The value of the current option */
    eventKey?: T;
    /** Displays a custom panel */
    panel?: boolean;
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /** Whether the submenu is expanded, used in Sidenav. */
    expanded?: boolean;
    /** Select the callback function for the current option  */
    onSelect?: (eventKey: T, event: React.SyntheticEvent) => void;
}
/**
 * Tree View Node
 * @see https://www.w3.org/TR/wai-aria-practices-1.2/#TreeView
 */
declare const ExpandedSidenavDropdownItem: import("../internals/types").InternalRefForwardingComponent<"li", SidenavDropdownItemProps<any>, never> & Record<string, never>;
export default ExpandedSidenavDropdownItem;
