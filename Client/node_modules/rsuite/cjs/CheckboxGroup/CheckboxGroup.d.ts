import React from 'react';
import { BoxProps } from '../internals/Box';
import type { FormControlBaseProps } from '../internals/types';
export interface CheckboxGroupProps<V = (string | number)[]> extends BoxProps, FormControlBaseProps<V> {
    /** Used for the name of the form */
    name?: string;
    /** Primary content */
    children?: React.ReactNode;
    /** Inline layout */
    inline?: boolean;
}
/**
 * The `CheckboxGroup` component is used for selecting multiple options which are unrelated.
 * @see https://rsuitejs.com/components/checkbox/#checkbox-group
 */
declare const CheckboxGroup: import("../internals/types").InternalRefForwardingComponent<"div", CheckboxGroupProps<(string | number)[]>, never> & Record<string, never>;
export default CheckboxGroup;
