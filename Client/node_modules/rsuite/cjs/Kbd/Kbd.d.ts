import { BoxProps } from '../internals/Box';
import type { Size } from '../internals/types';
export interface KbdProps extends BoxProps {
    /**
     * Sets Kbd size.
     */
    size?: Size;
}
/**
 *
 * The `Kbd` component is used to display a Kbd.
 *
 * @see https://rsuitejs.com/components/kbd
 */
declare const Kbd: import("../internals/types").InternalRefForwardingComponent<"kbd", KbdProps, never> & Record<string, never>;
export default Kbd;
