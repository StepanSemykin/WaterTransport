import React from 'react';
import { BoxProps } from '../internals/Box';
import type { PlacementCorners, SanitizedHTMListProps } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
export type SidenavDropdownTrigger = 'click' | 'hover' | 'contextMenu';
export interface SidenavDropdownProps<T = any> extends BoxProps, SanitizedHTMListProps {
    /** Define the title as a submenu */
    title?: React.ReactNode;
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /** Triggering events */
    trigger?: SidenavDropdownTrigger | readonly SidenavDropdownTrigger[];
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
    noCaret?: boolean;
    /**
     * Open the menu and control it
     * @deprecated
     */
    open?: boolean;
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
 *          Instead it's rendered by a <Nav.Menu> within a <Sidenav>
 *
 * <Sidenav>
 *   <Nav>
 *     <Nav.Menu> -> This submenu will render <SidenavDropdown> component
 *     </Nav.Menu>
 *   </Nav>
 * </Sidenav>
 */
declare const SidenavDropdown: import("../internals/types").InternalRefForwardingComponent<"div", SidenavDropdownProps<any>, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"li", import("../Nav/NavDropdownItem").NavDropdownItemProps<any>, never> & Record<string, never>;
    Menu: React.ForwardRefExoticComponent<import("../Nav/NavDropdownMenu").NavDropdownMenuProps<any> & SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
};
export default SidenavDropdown;
