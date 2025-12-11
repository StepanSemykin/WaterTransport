import { BoxProps } from '../internals/Box';
export interface SidebarProps extends BoxProps {
    /** Width */
    width?: number | string;
    /** Sidebar can be collapsed */
    collapsible?: boolean;
}
/**
 * The `Sidebar` component for use with the `Container` component.
 * @see https://rsuitejs.com/components/container/
 */
declare const Sidebar: import("../internals/types").InternalRefForwardingComponent<"aside", SidebarProps, never> & Record<string, never>;
export default Sidebar;
