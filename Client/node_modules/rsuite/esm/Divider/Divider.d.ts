import React from 'react';
import type { Size, Color } from '../internals/types';
import type { BoxProps } from '../internals/Box';
export interface DividerProps extends BoxProps {
    /**
     * The appearance of the divider.
     */
    appearance?: 'solid' | 'dashed' | 'dotted';
    /**
     * The content of the label.
     */
    label?: React.ReactNode;
    /**
     * The placement of the label.
     * @version 6.0.0
     */
    labelPlacement?: 'start' | 'center' | 'end';
    /**
     * Vertical dividing line. Cannot be used with label.
     */
    vertical?: boolean;
    /**
     * The size of the divider.
     */
    size?: Size | number | string;
    /**
     * The color of the divider.
     */
    color?: Color | React.CSSProperties['color'];
    /**
     * The spacing between the divider and its content.
     */
    spacing?: Size | number | string;
}
/**
 * The Divider component is used to separate content.
 * @see https://rsuitejs.com/components/divider
 */
declare const Divider: import("../internals/types").InternalRefForwardingComponent<"div", DividerProps, never> & Record<string, never>;
export default Divider;
