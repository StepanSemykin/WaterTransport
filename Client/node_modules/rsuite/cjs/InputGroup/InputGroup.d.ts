import React from 'react';
import { BoxProps } from '../internals/Box';
import type { Size } from '../internals/types';
export interface InputGroupProps extends BoxProps {
    /** Sets the composition content internally */
    inside?: boolean;
    /** An Input group can show that it is disabled */
    disabled?: boolean;
    /** Primary content */
    children?: React.ReactNode;
    /** A component can have different sizes */
    size?: Size;
}
/**
 * The `InputGroup` component is used to specify an input field with an add-on.
 * @see https://rsuitejs.com/components/input/#input-group
 */
declare const InputGroup: import("../internals/types").InternalRefForwardingComponent<"div", InputGroupProps, never> & {
    Addon: import("../internals/types").InternalRefForwardingComponent<"span", import("./InputGroupAddon").InputGroupAddonProps, never> & Record<string, never>;
    Button: React.ForwardRefExoticComponent<import("..").ButtonProps & React.RefAttributes<any>>;
};
export default InputGroup;
