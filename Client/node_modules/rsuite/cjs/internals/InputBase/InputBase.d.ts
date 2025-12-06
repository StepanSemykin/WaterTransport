import React from 'react';
import { BoxProps } from '../Box';
import { PrependParameters } from '../types/utils';
import type { PropsWithoutChange, FormControlBaseProps, Size } from '../types';
export interface InputBaseLocaleType {
    unfilled: string;
}
export interface InputBaseCommonProps extends Omit<BoxProps, 'height' | 'width'>, PropsWithoutChange<FormControlBaseProps> {
    /** A component can have different sizes */
    size?: Size;
    /** The HTML input id */
    id?: string;
    /** Ref of input element */
    inputRef?: React.Ref<any>;
    /** Is plaintext display mode */
    plaintext?: boolean;
    /** Input placeholder text */
    placeholder?: string;
}
export interface InputBaseProps extends InputBaseCommonProps {
    /** Component element type */
    as?: React.ElementType;
    /** Class prefix for component */
    classPrefix?: string;
    /** HTML input props */
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    /** Event handler for focus event */
    onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    /** Event handler for blur event */
    onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    /** Event handler for keydown event */
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    /** Input specific props like handling enter key for Input */
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement>;
    /** The callback function in which value is changed. */
    onChange?: PrependParameters<React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>, [
        value: string
    ]>;
}
/**
 * The `InputBase` component serves as the base for both Input and Textarea components.
 * It provides common functionality for both components.
 */
declare const InputBase: import("../types").InternalRefForwardingComponent<"input" | "textarea", InputBaseProps, never> & Record<string, never>;
export default InputBase;
