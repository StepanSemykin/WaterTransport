import React from 'react';
import { BaseBoxProps } from '../internals/Box';
export interface InputGroupAddonProps extends BaseBoxProps, React.HTMLAttributes<HTMLSpanElement> {
    /** An Input group addon can show that it is disabled */
    disabled?: boolean;
}
/**
 * The `InputGroup.Addon` component is used to specify an input field with an add-on.
 * @see https://rsuitejs.com/components/input/#input-group
 */
declare const InputGroupAddon: import("../internals/types").InternalRefForwardingComponent<"span", InputGroupAddonProps, never> & Record<string, never>;
export default InputGroupAddon;
