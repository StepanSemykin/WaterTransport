import React from 'react';
import { BaseBoxProps } from '../internals/Box';
import type { HTMLPropsWithoutSelect } from '../internals/types';
export interface NavProps<T = any> extends BaseBoxProps, HTMLPropsWithoutSelect {
    /**
     * The appearance style of the Nav component.
     * - 'pills' appearance is deprecated. Use `SegmentedControl` component instead.
     * @default 'default'
     */
    appearance?: 'default' | 'subtle' | 'tabs';
    /**
     * Whether the Nav component is reversed.
     */
    reversed?: boolean;
    /**
     * Whether the Nav component is justified.
     */
    justified?: boolean;
    /**
     * Whether the Nav component is vertical.
     */
    vertical?: boolean;
    /**
     * Whether the Nav component is pulled to the right.
     *
     * @deprecated Use `Navbar.Content` instead.
     */
    pullRight?: boolean;
    /**
     * The active key of the Nav component.
     */
    activeKey?: T;
    /**
     * The default active key of the Nav component.
     */
    defaultActiveKey?: T;
    /**
     * Event handler for selecting a Nav item.
     */
    onSelect?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
}
/**
 * The `Nav` component is used to create navigation links.
 * @see https://rsuitejs.com/components/nav
 */
declare const Nav: import("../internals/types").InternalRefForwardingComponent<"div", NavProps<any>, never> & {
    /**
     * @deprecated Use <Nav.Menu> instead.
     */
    Dropdown: import("../internals/types").InternalRefForwardingComponent<"div", import("./NavDropdown").NavDropdownProps<any>, never> & {
        Item: import("../internals/types").InternalRefForwardingComponent<"li", import("./NavDropdownItem").NavDropdownItemProps<any>, never> & Record<string, never>;
        Menu: React.ForwardRefExoticComponent<import("./NavDropdownMenu").NavDropdownMenuProps<any> & import("../internals/types").SanitizedHTMListProps<HTMLElement, React.HTMLAttributes<HTMLElement>> & React.RefAttributes<HTMLElement>>;
    };
    Item: import("../internals/types").InternalRefForwardingComponent<"a", import("./NavItem").NavItemProps<string | number>, never> & Record<string, never>;
    Menu: React.ForwardRefExoticComponent<import("./NavMenu").NavMenuProps & React.RefAttributes<any>>;
    MegaMenu: React.ForwardRefExoticComponent<import("../Navbar/NavbarMegaMenu").NavbarMegaMenuProps & React.RefAttributes<any>>;
};
export default Nav;
