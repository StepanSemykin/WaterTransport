import React from 'react';
import type { IconProps } from '@rsuite/icons/Icon';
import type { BoxProps } from '../internals/Box';
import type { HTMLPropsWithoutSelect } from '../internals/types';
import type { DeprecatedDropdownItemProps } from '../Dropdown/types';
export interface NavDropdownItemProps<T = any> extends BoxProps, DeprecatedDropdownItemProps, HTMLPropsWithoutSelect {
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
    /** Select the callback function for the current option  */
    onSelect?: (eventKey: T, event: React.SyntheticEvent) => void;
}
/**
 * @private
 */
declare const NavDropdownItem: import("../internals/types").InternalRefForwardingComponent<"li", NavDropdownItemProps<any>, never> & Record<string, never>;
export default NavDropdownItem;
