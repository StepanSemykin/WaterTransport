import { StackProps } from './Stack';
export interface HStackProps extends Omit<StackProps, 'direction'> {
    /**
     * Reverse the order of the children in the stack
     */
    reverse?: boolean;
}
declare const HStack: import("../internals/types").InternalRefForwardingComponent<"div", HStackProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("./StackItem").StackItemProps, never> & Record<string, never>;
};
export default HStack;
