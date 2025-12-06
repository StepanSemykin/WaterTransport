import React from 'react';
import { ModalProps } from '../Modal';
import type { PlacementCardinal } from '../internals/types';
export interface DrawerProps extends Omit<ModalProps, 'overflow'> {
    /** The placement of Drawer */
    placement?: PlacementCardinal;
    /** Custom close button */
    closeButton?: React.ReactNode | boolean;
}
/**
 * The Drawer component is used to display extra content from a main content.
 * @see https://rsuitejs.com/components/drawer
 */
declare const Drawer: import("../internals/types").InternalRefForwardingComponent<"div", DrawerProps, never> & {
    Body: import("../internals/types").InternalRefForwardingComponent<"div", import("..").BoxProps, never> & Record<string, never>;
    Header: import("../internals/types").InternalRefForwardingComponent<"div", import("../Modal").ModalHeaderProps, never> & Record<string, never>;
    Actions: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Title: import("../internals/types").InternalRefForwardingComponent<"div", import("../internals/utils").ComponentProps, never> & Record<string, never>;
    /**
     * @deprecated use <Drawer.Actions> instead
     */
    Footer: import("../internals/types").InternalRefForwardingComponent<"div", import("../internals/utils").ComponentProps, never> & Record<string, never>;
};
export default Drawer;
