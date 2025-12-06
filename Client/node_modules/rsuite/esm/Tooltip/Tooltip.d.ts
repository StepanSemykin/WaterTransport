import React from 'react';
import { BoxProps } from '../internals/Box';
import type { Placement } from '../internals/types';
export interface TooltipProps extends BoxProps {
    /** Dispaly placement */
    placement?: Placement;
    /** Whether visible */
    visible?: boolean;
    /** Primary content */
    children?: React.ReactNode;
    /** Whether show the arrow indicator */
    arrow?: boolean;
}
/**
 * The `Tooltip` component is used to describe a element.
 *
 * @see https://rsuitejs.com/components/tooltip
 */
declare const Tooltip: import("../internals/types").InternalRefForwardingComponent<"div", TooltipProps, never> & Record<string, never>;
export default Tooltip;
