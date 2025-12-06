import React from 'react';
import { PickerLocale } from '../locales';
import { PickerToggleProps } from '../internals/Picker';
import type { ListProps } from '../internals/Windowing';
import type { FormControlPickerProps, Option, ListboxProps, PopupProps, DeprecatedMenuProps } from '../internals/types';
export interface SelectProps<T> extends ListboxProps, PopupProps, DeprecatedMenuProps {
    /** Set group condition key in data */
    groupBy?: string;
    /** Whether dispaly search input box */
    searchable?: boolean;
    /** Whether using virtualized list */
    virtualized?: boolean;
    /**
     * Virtualized List Props
     */
    listProps?: Partial<ListProps>;
    /** Custom search rules. */
    searchBy?: (keyword: string, label: React.ReactNode, item: Option) => boolean;
    /** Sort options */
    sort?: (isGroup: boolean) => (a: any, b: any) => number;
    /** Custom render selected items */
    renderValue?: (value: T, item: Option<T>, selectedElement: React.ReactNode) => React.ReactNode;
    /** Called when the option is selected */
    onSelect?: (value: any, item: Option<T>, event: React.SyntheticEvent) => void;
    /** Called after clicking the group title */
    onGroupTitleClick?: (event: React.SyntheticEvent) => void;
    /** Called when searching */
    onSearch?: (searchKeyword: string, event?: React.SyntheticEvent) => void;
    /** Called when clean */
    onClean?: (event: React.SyntheticEvent) => void;
}
export interface SelectPickerProps<T = any> extends Omit<FormControlPickerProps<T, PickerLocale, Option<T>>, 'value' | 'defaultValue' | 'onChange'>, SelectProps<T>, Pick<PickerToggleProps, 'caretAs' | 'label' | 'loading'> {
    /** Initial value */
    defaultValue?: T;
    /** Current value of the component. Creates a controlled component */
    value?: T | null;
    /** Called after the value has been changed */
    onChange?: (value: T | null, event: React.SyntheticEvent) => void;
}
export interface SelectPickerComponent {
    <T>(props: SelectPickerProps<T>): React.ReactElement | null;
    displayName?: string;
}
/**
 * The `SelectPicker` component is used to select an item from a list of data.
 * @see https://rsuitejs.com/components/select-picker/
 */
declare const SelectPicker: SelectPickerComponent;
export default SelectPicker;
