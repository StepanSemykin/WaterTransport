/// <reference types="react" />
import { NumberInputProps as InputNumberProps } from '../NumberInput';
/**
 * The `InputNumber` component is used to enter a numerical value.
 * @see https://rsuitejs.com/components/number-input
 * @deprecated Use `NumberInput` instead.
 */
declare const InputNumber: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"div", import("..").InputGroupProps, never> & {
    Addon: import("../internals/types").InternalRefForwardingComponent<"span", import("..").InputGroupAddonProps, never> & Record<string, never>;
    Button: import("react").ForwardRefExoticComponent<import("..").ButtonProps & import("react").RefAttributes<any>>;
}, InputNumberProps<string | number | null>, never> & Record<string, never>;
export type { InputNumberProps };
export { InputNumber };
export default InputNumber;
