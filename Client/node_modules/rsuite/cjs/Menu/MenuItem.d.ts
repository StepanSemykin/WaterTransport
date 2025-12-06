import React from 'react';
import type { IconProps } from '@rsuite/icons/Icon';
import type { HTMLPropsWithoutSelect } from '../internals/types';
import type { BoxProps } from '../internals/Box';
export interface MenuItemProps<T = any> extends BoxProps, HTMLPropsWithoutSelect {
    /** Active the current option */
    active?: boolean;
    /** Disable the current option */
    disabled?: boolean;
    /** The description of the current option */
    description?: React.ReactNode;
    /** The value of the current option */
    eventKey?: T;
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /**
     * The menu item keyboard shortcut.
     */
    shortcut?: React.ReactNode;
    /**
     * Select the callback function for the current option
     */
    onSelect?: (eventKey: T, event: React.SyntheticEvent) => void;
}
declare const MenuItem: import("../internals/types").InternalRefForwardingComponent<"li", MenuItemProps<any>, never> & Record<string, never>;
export default MenuItem;
