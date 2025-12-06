import React from 'react';
import type { StandardProps, SanitizedHTMListProps } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
import type { DeprecatedDropdownMenuProps } from '../Dropdown/types';
export interface NavDropdownMenuProps<T = any> extends StandardProps, DeprecatedDropdownMenuProps {
    /** Define the title as a submenu */
    title?: React.ReactNode;
    /**
     * Direction that the sub-menu open towards
     * - start: towards the head of the reading direction (right by default, left in RTL)
     * - end: towards the end of the reading direction (left by default, right in RTL)
     *
     * @default 'end'
     */
    openDirection?: 'start' | 'end';
    /** No caret variation */
    noCaret?: boolean;
    /**
     * Only used for setting the default expand state when it's a submenu.
     */
    eventKey?: T;
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /** Whether the dropdown menu is open */
    open?: boolean;
    /** Whether the dropdown menu is collapsible */
    collapsible?: boolean;
    /** Whether the dropdown menu is expanded */
    expanded?: boolean;
    /** Whether the dropdown menu is active */
    active?: boolean;
    /** Whether the dropdown menu is disabled */
    disabled?: boolean;
    /**
     * Callback function that is triggered when the dropdown menu is toggled
     * @param open - Whether the dropdown menu is open
     * @param eventKey - The eventKey of the dropdown menu
     * @param event - The event object
     */
    onToggle?: (open: boolean, eventKey?: T | undefined, event?: React.SyntheticEvent) => void;
}
/**
 * @private
 */
declare const NavDropdownMenu: React.ForwardRefExoticComponent<NavDropdownMenuProps<any> & SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
export default NavDropdownMenu;
