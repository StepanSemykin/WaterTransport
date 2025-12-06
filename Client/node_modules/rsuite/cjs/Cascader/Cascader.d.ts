import React from 'react';
import { PickerLocale } from '../locales';
import { PickerToggleProps } from '../internals/Picker';
import { Option, OptionValue, FormControlPickerProps, DeprecatedMenuProps } from '../internals/types';
import type { CascadeTreeProps } from '../CascadeTree/types';
interface DeprecatedProps extends DeprecatedMenuProps {
    /**
     * The panel is displayed directly when the component is initialized
     * @deprecated Use CascadeTree instead
     * @see CascadeTree https://rsuitejs.com/components/cascade-tree
     */
    inline?: boolean;
}
export interface CascaderProps<T = OptionValue> extends FormControlPickerProps<T, PickerLocale, Option<T>>, CascadeTreeProps<T, T, PickerLocale>, DeprecatedProps, Pick<PickerToggleProps, 'label' | 'caretAs' | 'loading'> {
    /**
     * When true, make the parent node selectable
     */
    parentSelectable?: boolean;
    /**
     * Custom render selected items
     */
    renderValue?: (value: T, selectedPaths: Option<T>[], selectedElement: React.ReactNode) => React.ReactNode;
    /**
     * Called when clean
     */
    onClean?: (event: React.SyntheticEvent) => void;
}
export interface CascaderComponent {
    <T>(props: CascaderProps<T>): React.ReactElement | null;
    displayName?: string;
}
/**
 * The `Cascader` component displays a hierarchical list of options.
 * @see https://rsuitejs.com/components/cascader
 */
declare const Cascader: CascaderComponent;
export default Cascader;
