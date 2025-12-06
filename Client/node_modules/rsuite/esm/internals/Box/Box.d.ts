import { CSSSystemProps } from '../styled-system';
import type { WithAsProps, Breakpoints } from '../types';
export interface BoxProps extends WithAsProps, CSSSystemProps {
    /** Breakpoint below which the component is shown with `display: block` */
    showFrom?: Breakpoints;
    /** Breakpoint above which the component is hidden with `display: none` */
    hideFrom?: Breakpoints;
}
export type BaseBoxProps = Omit<BoxProps, 'color'>;
/**
 * Box component is the base component for all components,
 * providing shorthand for style properties.
 *
 * @see https://rsuitejs.com/components/box
 */
declare const Box: import("../types").InternalRefForwardingComponent<"div", BoxProps, never> & Record<string, never>;
export default Box;
