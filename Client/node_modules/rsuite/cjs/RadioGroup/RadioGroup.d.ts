import React from 'react';
import { BoxProps } from '../internals/Box';
import type { PrependParameters, FormControlBaseProps } from '../internals/types';
export interface RadioContextProps {
    inline?: boolean;
    name?: string;
    value?: string | number | null;
    controlled?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    plaintext?: boolean;
    onChange?: PrependParameters<React.ChangeEventHandler<HTMLInputElement>, [
        value: string | number | undefined
    ]>;
}
export interface RadioGroupProps<T = string | number> extends BoxProps, FormControlBaseProps<T> {
    /**
     * A radio group can have different appearances
     * @deprecated Use `<SegmentedControl indicator="underline" />` instead
     */
    appearance?: 'default' | 'picker';
    /** Name to use for form */
    name?: string;
    /** Inline layout */
    inline?: boolean;
    /** Primary content */
    children?: React.ReactNode;
}
export declare const RadioContext: React.Context<RadioContextProps | undefined>;
/**
 * The `RadioGroup` component is used to group a collection of `Radio` components.
 * @see https://rsuitejs.com/components/radio/#radio-group
 */
declare const RadioGroup: import("../internals/types").InternalRefForwardingComponent<"div", RadioGroupProps<string | number>, never> & Record<string, never>;
export default RadioGroup;
