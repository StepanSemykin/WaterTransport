import React from 'react';
import { InputBaseCommonProps } from '../internals/InputBase';
import type { PrependParameters, SanitizedTextareaProps, PropsWithoutChange, FormControlBaseProps, Size } from '../internals/types';
export interface TextareaProps extends InputBaseCommonProps, SanitizedTextareaProps, PropsWithoutChange<FormControlBaseProps> {
    /**
     * The size of the textarea.
     * @default 'md'
     */
    size?: Size;
    /** Enable auto resize of the textarea based on content */
    autosize?: boolean;
    /**
     * Maximum number of rows up to which the textarea can grow
     * Auto resize props for react-textarea-autosize
     */
    maxRows?: number;
    /**
     * Minimum number of rows up to which the textarea can shrink
     * Auto resize props for react-textarea-autosize
     */
    minRows?: number;
    /**
     * Whether to allow the textarea to be resized
     */
    resize?: React.CSSProperties['resize'];
    /**
     * Called when Enter key is pressed
     */
    onPressEnter?: React.KeyboardEventHandler<HTMLTextAreaElement>;
    /**
     * The callback function in which value is changed.
     */
    onChange?: PrependParameters<React.ChangeEventHandler<HTMLTextAreaElement>, [value: string]>;
}
declare const Textarea: import("../internals/types").InternalRefForwardingComponent<"textarea", TextareaProps, never> & Record<string, never>;
export default Textarea;
