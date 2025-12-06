import React, { CSSProperties } from 'react';
import { BoxProps } from '../internals/Box';
import type { WithResponsive } from '../internals/types';
export interface StackProps extends BoxProps {
    /** The direction of the children in the stack */
    direction?: WithResponsive<CSSProperties['flexDirection']>;
    /** Add an element between each child */
    divider?: React.ReactNode;
    /** Define whether the children in the stack are forced onto one line or can wrap onto multiple lines */
    wrap?: boolean;
}
/**
 * The `Stack` component is a quick layout component through Flexbox,
 * supporting vertical and horizontal stacking, custom spacing and line wrapping.
 *
 * @see https://rsuitejs.com/components/stack
 */
declare const Stack: import("../internals/types").InternalRefForwardingComponent<"div", StackProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("./StackItem").StackItemProps, never> & Record<string, never>;
};
export default Stack;
