import React from 'react';
import { BoxProps } from '../internals/Box';
import type { SanitizedInputProps, Color, Size } from '../internals/types';
import type { ToggleLocale } from '../locales';
export interface ToggleProps extends Omit<BoxProps, 'height' | 'width'>, SanitizedInputProps {
    /**
     * The color of the toggle.
     */
    color?: Color;
    /**
     * Whether to disabled toggle
     */
    disabled?: boolean;
    /**
     * Render the control as plain text
     */
    plaintext?: boolean;
    /**
     * Make the control readonly
     */
    readOnly?: boolean;
    /**
     * Whether the checked state is being updated
     */
    loading?: boolean;
    /**
     * Whether the toggle is checked （Controlled)
     */
    checked?: boolean;
    /**
     * Whether the toggle is checked (Uncontrolled)
     */
    defaultChecked?: boolean;
    /**
     * Checked display content
     */
    checkedChildren?: React.ReactNode;
    /**
     * Unchecked display content
     */
    unCheckedChildren?: React.ReactNode;
    /**
     * The size of the toggle
     */
    size?: Size;
    /**
     * Custom locale
     */
    locale?: ToggleLocale;
    /**
     * The label of the toggle switch
     */
    label?: React.ReactNode;
    /**
     * The placement of the label
     * @version 6.0.0
     */
    labelPlacement?: 'start' | 'end';
    /**
     * Called when the state of the toggle changes
     */
    onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
}
/**
 * The `Toggle` component is used to activate or deactivate an element.
 *
 * @see https://rsuitejs.com/components/toggle
 */
declare const Toggle: import("../internals/types").InternalRefForwardingComponent<"label", ToggleProps, never> & Record<string, never>;
export default Toggle;
