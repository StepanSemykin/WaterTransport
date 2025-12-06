import React from 'react';
import { PickerToggleProps } from '../internals/Picker';
import type { PickerLocale } from '../locales';
import type { Option, FormControlPickerProps } from '../internals/types';
import type { SelectProps } from '../SelectPicker';
export type ValueType = (number | string)[];
export interface CheckPickerProps<T = any> extends FormControlPickerProps<T[], PickerLocale, Option<T>>, Omit<SelectProps<T>, 'renderValue'>, Pick<PickerToggleProps, 'label' | 'caretAs' | 'loading'> {
    /** Top the selected option in the options */
    sticky?: boolean;
    /** A picker that can be counted */
    countable?: boolean;
    /** Custom render selected items */
    renderValue?: (value: T[], item: Option<T>[], selectedElement: React.ReactNode) => React.ReactNode;
}
export interface CheckPickerComponent {
    <T>(props: CheckPickerProps<T>): React.ReactElement | null;
    displayName?: string;
}
/**
 * A component for selecting checkable items in a dropdown list.
 * @see https://rsuitejs.com/components/check-picker
 */
declare const CheckPicker: CheckPickerComponent;
export default CheckPicker;
