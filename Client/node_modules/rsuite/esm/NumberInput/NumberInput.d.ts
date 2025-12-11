import React from 'react';
import { BoxProps } from '../internals/Box';
import type { SanitizedInputProps, FormControlBaseProps, AppearanceType, BasicSize } from '../internals/types';
export interface NumberInputProps<T = number | string | null> extends Omit<SanitizedInputProps, 'value' | 'defaultValue' | 'prefix'>, Omit<BoxProps, 'height' | 'width'>, FormControlBaseProps<T> {
    /**
     * Button can have different appearances
     */
    buttonAppearance?: AppearanceType;
    /**
     * An input can show that it is disabled
     */
    disabled?: boolean;
    /**
     *
     * Decimal separator
     * https://en.wikipedia.org/wiki/Decimal_separator
     *
     * @default '.'
     * @version 5.69.0
     */
    decimalSeparator?: string;
    /**
     * Format the value of the input
     */
    formatter?: (value: number | string) => string;
    /**
     * Minimum value
     */
    min?: number;
    /**
     * Maximum value
     */
    max?: number;
    /**
     * The value of each step. can be decimal
     */
    step?: number;
    /**
     * Sets the element displayed to the left of the component
     */
    prefix?: React.ReactNode;
    /**
     * Sets the element displayed on the right side of the component
     * @deprecated Use `suffix` instead.
     */
    postfix?: React.ReactNode;
    /**
     * Sets the element displayed on the right side of the component
     */
    suffix?: React.ReactNode;
    /**
     * An Input can have different sizes
     */
    size?: BasicSize;
    /**
     * Whether the value can be changed through the wheel event
     */
    scrollable?: boolean;
    /**
     * Show or hide control icons:
     * - `true` (default): show default up/down buttons.
     * - `false`: hide controls.
     * - `(trigger) => ReactNode`: fully custom control per trigger ('up' | 'down').
     */
    controls?: boolean | ((trigger: 'up' | 'down') => React.ReactNode);
    /**
     * Callback function when wheel event is triggered
     */
    onWheel?: (event: React.WheelEvent) => void;
}
/**
 * The `NumberInput` component is used to enter a numerical value.
 * @see https://rsuitejs.com/components/number-input
 */
declare const NumberInput: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"div", import("../InputGroup/InputGroup").InputGroupProps, never> & {
    Addon: import("../internals/types").InternalRefForwardingComponent<"span", import("../InputGroup/InputGroupAddon").InputGroupAddonProps, never> & Record<string, never>;
    Button: React.ForwardRefExoticComponent<import("../Button").ButtonProps & React.RefAttributes<any>>;
}, NumberInputProps<string | number | null>, never> & Record<string, never>;
export default NumberInput;
