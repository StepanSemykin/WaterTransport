import React from 'react';
import type { FormControlPickerProps, Placement, Option, BasicSize, ListboxProps, PopupProps } from '../internals/types';
import type { BoxProps } from '../internals/Box';
export interface AutoCompleteProps<T = string> extends FormControlPickerProps<T, any, Option | string>, ListboxProps, PopupProps, BoxProps {
    /** The placement of component */
    placement?: Placement;
    /** When set to false, the Enter key selection function is invalid */
    selectOnEnter?: boolean;
    /** A component can have different sizes */
    size?: BasicSize;
    /** Open the menu and control it */
    open?: boolean;
    /** Placeholder text */
    placeholder?: string;
    /** AutoComplete Content */
    autoComplete?: string;
    /** Custom filter function to determine whether the item will be displayed */
    filterBy?: (value: string, item: Option) => boolean;
    /** Called when a option is selected */
    onSelect?: (value: any, item: Option, event: React.SyntheticEvent) => void;
    /** Called on focus */
    onFocus?: React.FocusEventHandler;
    /** Called on blur */
    onBlur?: React.FocusEventHandler;
    /** Called on menu focus */
    onMenuFocus?: (focusItemValue: any, event: React.KeyboardEvent) => void;
    /** The callback triggered by keyboard events. */
    onKeyDown?: (event: React.KeyboardEvent) => void;
    /** Called on open */
    onOpen?: () => void;
    /** Called on close */
    onClose?: () => void;
}
/**
 * Autocomplete function of input field.
 * @see https://rsuitejs.com/components/auto-complete
 *
 * TODO: Remove unnecessary .rs-auto-complete element
 * TODO: role=combobox and aria-autocomplete on input element
 */
declare const AutoComplete: import("../internals/types").InternalRefForwardingComponent<"div", AutoCompleteProps<string>, never> & Record<string, never>;
export default AutoComplete;
