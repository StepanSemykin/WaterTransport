import React from 'react';
import { BoxProps } from '../internals/Box';
import type { Color, PlacementCorners, Size } from '../internals/types';
export interface BadgeProps extends BoxProps {
    /**
     * The content of the badge
     */
    content?: React.ReactNode;
    /**
     * The maximum value of the badge
     */
    maxCount?: number;
    /**
     * A badge can have different colors
     */
    color?: Color | React.CSSProperties['color'];
    /**
     * The badge will have an outline
     * @version 6.0.0
     */
    outline?: boolean;
    /**
     * The placement of the badge
     * @version 6.0.0
     */
    placement?: PlacementCorners;
    /**
     * If true, the Badge will have no padding, making it appear more compact and rounded.
     */
    compact?: boolean;
    /**
     * The shape of the wrapped element
     * @version 6.0.0
     */
    shape?: 'rectangle' | 'circle';
    /**
     * A badge can have different sizes
     */
    size?: Size;
    /**
     * Define the horizontal and vertical offset of the badge relative to its wrapped element
     * @version 6.0.0
     */
    offset?: [number | string, number | string];
    /**
     * The badge will be hidden
     * @version 6.0.0
     */
    invisible?: boolean;
}
/**
 * The Badge component is usually used to mark or highlight the status or quantity of an object.
 * @see https://rsuitejs.com/components/badge
 */
declare const Badge: import("../internals/types").InternalRefForwardingComponent<"div", BadgeProps, never> & Record<string, never>;
export default Badge;
