import React from 'react';
import type { WithAsProps } from '../types';
export interface RippleProps extends WithAsProps {
    onMouseDown?: (position: any, event: React.MouseEvent) => void;
}
/**
 * The `Ripple` component is used to implement the ripple effect.
 * @private
 */
declare const Ripple: import("../types").InternalRefForwardingComponent<"span", RippleProps, never> & Record<string, never>;
export default Ripple;
