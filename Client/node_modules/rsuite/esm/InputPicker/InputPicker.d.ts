import React from 'react';
import { InputOption } from './hooks/useData';
import { PickerToggleProps } from '../internals/Picker';
import type { Option, FormControlPickerProps } from '../internals/types';
import type { InputPickerLocale } from '../locales';
import type { SelectProps } from '../SelectPicker';
export type ValueType = any;
export interface InputPickerProps<V = ValueType> extends FormControlPickerProps<V, InputPickerLocale, InputOption>, Omit<SelectProps<V>, 'renderValue'>, Pick<PickerToggleProps, 'caretAs' | 'loading' | 'label'> {
    tabIndex?: number;
    /** Settings can create new options */
    creatable?: boolean;
    /** Option to cache value when searching asynchronously */
    cacheData?: InputOption<V>[];
    /** The `onBlur` attribute for the `input` element. */
    onBlur?: React.FocusEventHandler;
    /** The `onFocus` attribute for the `input` element. */
    onFocus?: React.FocusEventHandler;
    /** Called when the option is created */
    onCreate?: (value: V, item: Option, event: React.SyntheticEvent) => void;
    /**
     * Customize whether to display "Create option" action with given textbox value
     *
     * By default, InputPicker hides "Create option" action when textbox value matches any filtered item's [valueKey] property
     *
     * @param searchKeyword Value of the textbox
     * @param filteredData The items filtered by the searchKeyword
     */
    shouldDisplayCreateOption?: (searchKeyword: string, filteredData: InputOption<V>[]) => boolean;
    renderValue?: (value: V, item: Option<V>, selectedElement: React.ReactNode) => React.ReactNode;
}
/**
 * Single item selector with text box input.
 *
 * @see https://rsuitejs.com/components/input-picker
 */
declare const InputPicker: import("../internals/types").InternalRefForwardingComponent<"div", InputPickerProps<any>, never> & Record<string, never>;
export default InputPicker;
