import React from 'react';
import { BoxProps } from '../internals/Box';
import type { FormControlBaseProps } from '../internals/types';
export interface RadioTileContextProps {
    name?: string;
    value?: number | string | null;
    controlled?: boolean;
    disabled?: boolean;
    onChange?: (value: number | string | undefined, event: React.ChangeEvent<HTMLInputElement>) => void;
}
export interface RadioTileGroupProps<T = number | string> extends BoxProps, FormControlBaseProps<T> {
    /** Name to use for form */
    name?: string;
    /** Inline layout */
    inline?: boolean;
    /** Whether radio is disabled */
    disabled?: boolean;
    /** Primary content */
    children?: React.ReactNode;
}
export declare const RadioTileContext: React.Context<RadioTileContextProps>;
/**
 * The `RadioTileGroup` component is used to group a collection of `RadioTile` components.
 * @version 5.35.0
 * @see https://rsuitejs.com/components/radio-tile/
 */
declare const RadioTileGroup: import("../internals/types").InternalRefForwardingComponent<"div", RadioTileGroupProps<string | number>, never> & Record<string, never>;
export default RadioTileGroup;
