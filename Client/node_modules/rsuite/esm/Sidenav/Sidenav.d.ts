import React from 'react';
import { BoxProps } from '../internals/Box';
export interface SidenavProps<T = string | number> extends BoxProps {
    /** Whether to expand the Sidenav */
    expanded?: boolean;
    /** Menu style */
    appearance?: 'default' | 'inverse' | 'subtle';
    /** Open menu, corresponding to Dropdown eventkey */
    defaultOpenKeys?: T[];
    /** Open menu, corresponding to Dropdown eventkey (controlled) */
    openKeys?: T[];
    /**
     * Activation option, corresponding menu eventkey
     * @deprecated Use <Nav activeKey> instead
     */
    activeKey?: T;
    /** Menu opening callback function that changed */
    onOpenChange?: (openKeys: T[], event: React.SyntheticEvent) => void;
    /**
     * Select the callback function for the menu
     * @deprecated Use <Nav onSelect> instead
     */
    onSelect?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
}
/**
 * The `Sidenav` component is an encapsulation of the page sidebar `Nav`.
 * @see https://rsuitejs.com/components/sidenav/
 */
declare const Sidenav: import("../internals/types").InternalRefForwardingComponent<"div", SidenavProps<string | number>, never> & {
    Header: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Body: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Footer: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    GroupLabel: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Toggle: import("../internals/types").InternalRefForwardingComponent<"div", import("./SidenavToggle").SidenavToggleProps, never> & Record<string, never>;
};
export default Sidenav;
