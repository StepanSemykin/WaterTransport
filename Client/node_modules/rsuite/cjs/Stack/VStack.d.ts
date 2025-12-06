import { StackProps } from './Stack';
export interface VStackProps extends Omit<StackProps, 'direction'> {
    reverse?: boolean;
}
declare const VStack: import("../internals/types").InternalRefForwardingComponent<"div", VStackProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("./StackItem").StackItemProps, never> & Record<string, never>;
};
export default VStack;
