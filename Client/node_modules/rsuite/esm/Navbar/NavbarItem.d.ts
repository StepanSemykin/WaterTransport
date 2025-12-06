import React from 'react';
import { BoxProps } from '../internals/Box';
import type { IconProps } from '@rsuite/icons/Icon';
import type { HTMLPropsWithoutSelect } from '../internals/types';
export interface NavbarItemProps<T = string | number> extends BoxProps, HTMLPropsWithoutSelect {
    /** Activation status */
    active?: boolean;
    /** Disabled status */
    disabled?: boolean;
    /** Sets the icon for the component */
    icon?: React.ReactElement<IconProps>;
    /** The value of the current option */
    eventKey?: T;
    /** Providing a `href` will render an `<a>` element */
    href?: string;
    /** Select the callback function that the event triggers. */
    onSelect?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
}
/**
 * @private
 */
declare const NavbarItem: import("../internals/types").InternalRefForwardingComponent<"a", NavbarItemProps<string | number>, never> & Record<string, never>;
export default NavbarItem;
