import React from 'react';
import type { StandardProps, SanitizedHTMListProps } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
import type { DeprecatedDropdownMenuProps } from '../Dropdown/types';
export interface NavbarDropdownMenuProps<T = any> extends StandardProps, DeprecatedDropdownMenuProps {
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
    /** The currently active key in the dropdown menu */
    activeKey?: T;
    /**
     * Callback function when toggling the dropdown menu
     * @param open - Whether the menu is open
     * @param eventKey - The eventKey of the menu item
     * @param event - The event object
     */
    onToggle?: (open: boolean, eventKey?: T | undefined, event?: React.SyntheticEvent) => void;
}
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Menu> within a <Navbar>
 *
 * <Navbar>
 *   <Nav>
 *     <Nav.Menu>
 *       <Nav.Menu title="menu"> -> This submenu will render <NavbarDropdownMenu> component
 *       </Nav.Menu>
 *     </Nav.Menu>
 *   </Nav>
 * </Navbar>
 */
declare const NavbarDropdownMenu: React.ForwardRefExoticComponent<NavbarDropdownMenuProps<any> & SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
export default NavbarDropdownMenu;
