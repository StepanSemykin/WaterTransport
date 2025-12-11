import React from 'react';
import { BoxProps } from '../internals/Box';
export interface PopoverProps extends BoxProps {
    /** The title of the component. */
    title?: React.ReactNode;
    /** The component is visible by default. */
    visible?: boolean;
    /** The content full the container */
    full?: boolean;
    /** Whether show the arrow indicator */
    arrow?: boolean;
}
/**
 * The `Popover` component is used to display a popup window for a target component.
 * @see https://rsuitejs.com/components/popover
 */
declare const Popover: import("../internals/types").InternalRefForwardingComponent<"div", PopoverProps, never> & Record<string, never>;
export default Popover;
