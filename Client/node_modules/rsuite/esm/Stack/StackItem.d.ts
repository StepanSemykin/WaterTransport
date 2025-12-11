import React from 'react';
import { BoxProps } from '../internals/Box';
export interface StackItemProps extends BoxProps {
    /**
     * Define the alignment of the children in the stack on the cross axis
     * @deprecated Use `self` instead
     */
    alignSelf?: React.CSSProperties['alignSelf'];
}
/**
 * The `Stack.Item` component is used to set the layout of the child element in the `Stack` component.
 *
 * @see https://rsuitejs.com/components/stack
 */
declare const StackItem: import("../internals/types").InternalRefForwardingComponent<"div", StackItemProps, never> & Record<string, never>;
export default StackItem;
