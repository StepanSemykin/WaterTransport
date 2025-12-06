import React from 'react';
import type { BoxProps } from '../internals/Box';
import type { HTMLPropsWithoutSelect } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
import type { DeprecatedDropdownItemProps } from '../Dropdown/types';
export interface SidenavDropdownItemProps<T = any> extends BoxProps, DeprecatedDropdownItemProps, HTMLPropsWithoutSelect {
    /** Active the current option */
    active?: boolean;
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
    /** The submenu that this menuitem controls (if exists) */
    submenu?: React.ReactElement;
    /** Select the callback function for the current option  */
    onSelect?: (eventKey: T, event: React.SyntheticEvent) => void;
}
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Item> within a <Sidenav>
 *
 * <Sidenav>
 *   <Nav>
 *     <Nav.Menu>
 *       <Nav.Item></Nav.Item> -> This will render <SidenavDropdownItem> component
 *     </Nav.Menu>
 *   </Nav>
 * </Sidenav>
 */
declare const SidenavDropdownItem: import("../internals/types").InternalRefForwardingComponent<"li", SidenavDropdownItemProps<any>, never> & Record<string, never>;
export default SidenavDropdownItem;
