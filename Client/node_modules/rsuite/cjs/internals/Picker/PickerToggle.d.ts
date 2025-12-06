import React from 'react';
import { ToggleButtonProps } from './ToggleButton';
import type { IconProps } from '@rsuite/icons/Icon';
import type { Placement, OptionValue } from '../types';
export interface PickerToggleProps<T = OptionValue> extends ToggleButtonProps {
    active?: boolean;
    hasValue?: boolean;
    cleanable?: boolean;
    countable?: boolean;
    caret?: boolean;
    /**
     * Custom caret component
     * @deprecated Use `caretAs` instead
     */
    caretComponent?: React.FC<IconProps>;
    /**
     * Custom caret component
     */
    caretAs?: React.ElementType;
    disabled?: boolean;
    placement?: Placement;
    readOnly?: boolean;
    plaintext?: boolean;
    tabIndex?: number;
    /**
     * Whether to display an loading indicator on toggle button
     */
    loading?: boolean;
    label?: React.ReactNode;
    name?: string;
    inputValue?: T | T[];
    focusItemValue?: T | null;
    onClean?: (event: React.MouseEvent) => void;
}
declare const PickerToggle: import("../types").InternalRefForwardingComponent<React.ForwardRefExoticComponent<ToggleButtonProps & React.RefAttributes<HTMLDivElement>>, PickerToggleProps<OptionValue>, never> & Record<string, never>;
export default PickerToggle;
