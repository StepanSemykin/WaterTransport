import React from 'react';
import { BoxProps } from '../Box';
import type { Color } from '../types';
export interface BurgerProps extends BoxProps, React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Color of the Box */
    color?: Color | React.CSSProperties['color'];
    /** If true, burger is in open (X) state */
    open?: boolean;
    /** Thickness of the burger lines (px) */
    lineThickness?: number;
}
/**
 * Burger (hamburger menu) button for toggling navigation menus.
 */
declare const Burger: import("../types").InternalRefForwardingComponent<"button", BurgerProps, never> & Record<string, never>;
export default Burger;
