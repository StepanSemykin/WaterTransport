import { BoxProps } from '../internals/Box';
import type { BasicSize } from '../internals/types';
export interface ButtonGroupProps extends BoxProps {
    /** Display block buttongroups */
    block?: boolean;
    /** A button can show it is currently unable to be interacted with */
    disabled?: boolean;
    /** Add dividing lines between buttons */
    divided?: boolean;
    /** Vertical layouts of button */
    vertical?: boolean;
    /** Horizontal constant width layout */
    justified?: boolean;
    /**
     * An ARIA role describing the button group. Usually the default
     * "group" role is fine. An `aria-label` or `aria-labelledby`
     * prop is also recommended.
     */
    role?: string;
    /** A button group can have different sizes */
    size?: BasicSize;
}
/**
 * The ButtonGroup component is used to group a series of buttons together in a single line or column.
 * @see https://rsuitejs.com/components/button/#button-group
 */
declare const ButtonGroup: import("../internals/types").InternalRefForwardingComponent<"div", ButtonGroupProps, never> & Record<string, never>;
export default ButtonGroup;
