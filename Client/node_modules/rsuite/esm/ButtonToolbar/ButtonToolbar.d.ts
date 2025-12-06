import { StackProps } from '../Stack';
export interface ButtonToolbarProps extends StackProps {
    /**
     * The ARIA role describing the button toolbar. Generally the default
     * "toolbar" role is correct. An `aria-label` or `aria-labelledby`
     * prop is also recommended.
     */
    role?: string;
}
/**
 * The ButtonToolbar component is used to group a series of buttons together in a single line.
 * @see https://rsuitejs.com/components/button/#button-toolbar
 */
declare const ButtonToolbar: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"div", StackProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("../Stack/StackItem").StackItemProps, never> & Record<string, never>;
}, ButtonToolbarProps, never> & Record<string, never>;
export default ButtonToolbar;
