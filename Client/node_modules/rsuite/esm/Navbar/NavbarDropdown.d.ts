import React from 'react';
import { BoxProps } from '../internals/Box';
import type { PlacementCorners, WithAsProps } from '../internals/types';
import type { IconProps } from '@rsuite/icons/Icon';
export type NavbarDropdownTrigger = 'click' | 'hover' | 'contextMenu';
export interface NavbarDropdownProps<T = any> extends BoxProps, Omit<React.HTMLAttributes<HTMLElement>, 'onSelect' | 'onToggle' | 'title' | 'color'> {
    /** Define the title as a submenu */
    title?: React.ReactNode;
    /** Set the icon */
    icon?: React.ReactElement<IconProps>;
    /** Triggering events */
    trigger?: NavbarDropdownTrigger | readonly NavbarDropdownTrigger[];
    /** The placement of Menu */
    placement?: PlacementCorners;
    /** Whether or not component is disabled */
    disabled?: boolean;
    /** The style of the menu */
    menuStyle?: React.CSSProperties;
    /** A css class to apply to the Toggle DOM node */
    toggleClassName?: string;
    /** You can use a custom element type for this toggle component */
    toggleAs?: React.ElementType;
    /** No caret variation */
    noCaret?: boolean;
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
    renderToggle?: (props: WithAsProps, ref: React.Ref<any>) => any;
    /** The callback function that the menu closes */
    onClose?: () => void;
    /** Menu Pop-up callback function */
    onOpen?: () => void;
    /** Callback function for menu state switching */
    onToggle?: (open: boolean, eventKey?: T | undefined, event?: React.SyntheticEvent) => void;
}
/**
 * @private
 */
declare const NavbarDropdown: import("../internals/types").InternalRefForwardingComponent<"div", NavbarDropdownProps<any>, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"li", import("../Nav/NavDropdownItem").NavDropdownItemProps<any>, never> & Record<string, never>;
    Menu: React.ForwardRefExoticComponent<import("../Nav/NavDropdownMenu").NavDropdownMenuProps<any> & import("../internals/types").SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
};
export default NavbarDropdown;
