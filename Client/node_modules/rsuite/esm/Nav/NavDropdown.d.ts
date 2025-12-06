import React from 'react';
import { NavDropdownToggleProps } from './NavDropdownToggle';
import { BoxProps } from '../internals/Box';
import type { PlacementCorners, SanitizedHTMListProps } from '../internals/types';
export type NavDropdownTrigger = 'click' | 'hover' | 'contextMenu';
export interface NavDropdownProps<T = any> extends BoxProps, SanitizedHTMListProps {
    /** Define the title as a submenu */
    title?: React.ReactNode;
    /** Set the icon */
    icon?: NavDropdownToggleProps['icon'];
    /** Triggering events */
    trigger?: NavDropdownTrigger | readonly NavDropdownTrigger[];
    /** The placement of Menu */
    placement?: PlacementCorners;
    /** Whether or not component is disabled */
    disabled?: boolean;
    /** The style of the menu */
    menuStyle?: React.CSSProperties;
    /** A css class to apply to the Toggle DOM node */
    toggleClassName?: string;
    /** The value of the current option */
    eventKey?: T;
    /** You can use a custom element type for this toggle component */
    toggleAs?: React.ElementType;
    /** No caret variation */
    noCaret?: NavDropdownToggleProps['noCaret'];
    /**
     * Open the menu and control it
     * @deprecated
     */
    open?: boolean;
    /**
     * @deprecated
     */
    renderTitle?: (children: React.ReactNode) => React.ReactNode;
    /** Custom Toggle */
    renderToggle?: (props: BoxProps, ref: React.Ref<any>) => any;
    /** The callback function that the menu closes */
    onClose?: () => void;
    /** Menu Pop-up callback function */
    onOpen?: () => void;
    /** Callback function for menu state switching */
    onToggle?: (open: boolean, eventKey?: T | undefined, event?: React.SyntheticEvent) => void;
}
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a `<Nav.Menu>` call
 *
 * @example
 * <Nav>
 *   <Nav.Menu> -> This will render <NavDropdown> component
 *   </Nav.Menu>
 * </Nav>
 */
declare const NavDropdown: import("../internals/types").InternalRefForwardingComponent<"div", NavDropdownProps<any>, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"li", import("./NavDropdownItem").NavDropdownItemProps<any>, never> & Record<string, never>;
    Menu: React.ForwardRefExoticComponent<import("./NavDropdownMenu").NavDropdownMenuProps<any> & SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
};
export default NavDropdown;
