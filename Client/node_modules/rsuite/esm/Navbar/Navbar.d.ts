import React from 'react';
import { BoxProps } from '../internals/Box';
export interface NavbarProps extends BoxProps {
    /**
     * The appearance style of the Navbar component.
     */
    appearance?: 'default' | 'inverse' | 'subtle';
    /**
     * The open state of the drawer.
     */
    drawerOpen?: boolean;
    /**
     * Callback when the drawer is opened or closed.
     */
    onDrawerOpenChange?: (open: boolean) => void;
}
/**
 * The `Navbar` component is a wrapper that positions navigation elements.
 * @see https://rsuitejs.com/components/navbar
 */
declare const Navbar: import("../internals/types").InternalRefForwardingComponent<"div", NavbarProps, never> & {
    Brand: import("../internals/types").InternalRefForwardingComponent<"a", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Content: React.ForwardRefExoticComponent<import("./NavbarContent").NavbarContentProps & React.RefAttributes<any>>;
    Toggle: React.ForwardRefExoticComponent<import("./NavbarToggle").NavbarToggleProps & React.RefAttributes<any>>;
    Drawer: React.ForwardRefExoticComponent<import("..").DrawerProps & React.RefAttributes<any>>;
};
export default Navbar;
