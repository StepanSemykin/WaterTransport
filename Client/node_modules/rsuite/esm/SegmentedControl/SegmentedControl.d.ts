import React from 'react';
import { BoxProps } from '../internals/Box';
import type { FormControlBaseProps, Size } from '../internals/types';
export interface SegmentedItemDataType {
    /** The label of the item */
    label: React.ReactNode;
    /** The value of the item */
    value: string | number;
}
export interface SegmentedControlProps<T = string | number | null> extends BoxProps, Omit<FormControlBaseProps<T>, 'readOnly' | 'plaintext'> {
    /** The indicator style of the segmented control */
    indicator?: 'pill' | 'underline';
    /** Name to use for form */
    name?: string;
    /** Data of segmented items */
    data?: SegmentedItemDataType[];
    /** Display block style, fit the width of the container */
    block?: boolean;
    /** A segmented control can have different sizes */
    size?: Size;
}
/**
 * The `SegmentedControl` component is used to offer multiple exclusive options.
 * @see https://rsuitejs.com/components/segmented-control
 */
declare const SegmentedControl: import("../internals/types").InternalRefForwardingComponent<"div", SegmentedControlProps<string | number | null>, never> & Record<string, never>;
export default SegmentedControl;
