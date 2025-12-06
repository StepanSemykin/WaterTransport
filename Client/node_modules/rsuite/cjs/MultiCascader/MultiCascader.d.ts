import React from 'react';
import { PickerToggleProps } from '../internals/Picker';
import type { FormControlPickerProps, Option, DeprecatedMenuProps } from '../internals/types';
import type { PickerLocale } from '../locales';
import type { MultiCascadeTreeProps } from '../MultiCascadeTree';
interface DeprecatedProps extends DeprecatedMenuProps {
    /**
     * The panel is displayed directly when the component is initialized
     * @deprecated Use MultiCascadeTree instead
     * @see MultiCascadeTree https://rsuitejs.com/components/multi-cascade-tree
     */
    inline?: boolean;
}
export interface MultiCascaderProps<T = any> extends FormControlPickerProps<T[], PickerLocale, Option<T>, T>, MultiCascadeTreeProps<T, T[], PickerLocale>, DeprecatedProps, Pick<PickerToggleProps, 'label' | 'caretAs' | 'loading'> {
    /**
     * A picker that can be counted
     */
    countable?: boolean;
    /**
     * Custom render selected items
     */
    renderValue?: (value: T[], selectedItems: Option<T>[], selectedElement: React.ReactNode) => React.ReactNode;
    /**
     * Called when clean
     */
    onClean?: (event: React.SyntheticEvent) => void;
}
/**
 * The `MultiCascader` component is used to select multiple values from cascading options.
 * @see https://rsuitejs.com/components/multi-cascader/
 */
declare const MultiCascader: import("../internals/types").InternalRefForwardingComponent<"div", MultiCascaderProps<any>, never> & Record<string, never>;
export default MultiCascader;
