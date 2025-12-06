import React from 'react';
import { InputBaseCommonProps } from '../internals/InputBase';
import { PrependParameters } from '../internals/types/utils';
import type { SanitizedInputProps, PropsWithoutChange, FormControlBaseProps } from '../internals/types';
export interface InputProps extends InputBaseCommonProps, SanitizedInputProps, PropsWithoutChange<FormControlBaseProps> {
    /** The HTML input type */
    type?: string;
    /**
     * The htmlSize attribute defines the width of the <input> element.
     *
     * @see MDN https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/size
     * @version 5.49.0
     */
    htmlSize?: number;
    /**
     * The callback function in which value is changed.
     */
    onChange?: PrependParameters<React.ChangeEventHandler<HTMLInputElement>, [value: string]>;
    /** Called on press enter */
    onPressEnter?: React.KeyboardEventHandler<HTMLInputElement>;
}
/**
 * The `<Input>` component is used to get user input in a text field.
 *
 * @see https://rsuitejs.com/components/input
 */
declare const Input: import("../internals/types").InternalRefForwardingComponent<"input", InputProps, never> & Record<string, never>;
export default Input;
