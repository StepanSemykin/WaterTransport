import { BoxProps } from '../internals/Box';
import type { BasicSize } from '../internals/types';
export interface PinInputProps extends BoxProps {
    /** Whether input fields are attached (no gap between) */
    attached?: boolean;
    /** Whether to auto-focus the first input on mount */
    autoFocus?: boolean;
    /** Type of allowed input: number, alphabetic, alphanumeric, or custom regex */
    type?: 'number' | 'alphabetic' | 'alphanumeric' | RegExp;
    /** Default PIN value */
    defaultValue?: string;
    /** Whether to disable PIN input */
    disabled?: boolean;
    /** Number of PIN digits */
    length?: number;
    /** Whether to mask PIN input (like password) */
    mask?: boolean;
    /** Name for form submission */
    name?: string;
    /** Whether to optimize for one-time password (OTP) input */
    otp?: boolean;
    /** Placeholder for input fields */
    placeholder?: string;
    /** Whether the input is read-only */
    readOnly?: boolean;
    /** Input size */
    size?: BasicSize;
    /** PIN value */
    value?: string;
    /** Callback function when PIN input is completed */
    onComplete?: (value: string) => void;
    /** Callback function when PIN value changes */
    onChange?: (value: string) => void;
}
declare const PinInput: import("../internals/types").InternalRefForwardingComponent<"div", PinInputProps, never> & Record<string, never>;
export default PinInput;
