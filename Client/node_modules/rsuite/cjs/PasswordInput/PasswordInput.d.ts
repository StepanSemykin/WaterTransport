import React from 'react';
import { InputProps } from '../Input';
export interface PasswordInputProps extends Omit<InputProps, 'type' | 'plaintext'> {
    /** Controls whether the password is visible */
    visible?: boolean;
    /** Default visibility state of the password */
    defaultVisible?: boolean;
    /** The icon element to display before the input field */
    startIcon?: React.ReactNode;
    /**  The icon element to display after the input field */
    endIcon?: React.ReactNode;
    /** Custom icon for visibility toggle */
    renderVisibilityIcon?: (visible: boolean) => React.ReactNode;
    /** Callback function triggered when the password visibility changes */
    onVisibleChange?: (visible: boolean) => void;
}
declare const PasswordInput: import("../internals/types").InternalRefForwardingComponent<"input", PasswordInputProps, never> & Record<string, never>;
export default PasswordInput;
