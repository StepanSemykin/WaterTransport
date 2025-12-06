import React from 'react';
import { InputPickerProps } from '../InputPicker/InputPicker';
import { TagOnlyProps } from '../InputPicker/InputPickerContext';
import type { Option } from '../internals/types';
import type { CheckboxProps } from '../Checkbox';
interface DeprecatedProps {
    /**
     * @deprecated Use `renderCheckbox` instead
     */
    renderMenuItemCheckbox?: (checkboxProps: CheckboxProps) => React.ReactNode;
}
export interface TagPickerProps<V = any> extends Omit<InputPickerProps<V>, 'renderValue'>, DeprecatedProps, Partial<TagOnlyProps> {
    renderCheckbox?: (checkboxProps: CheckboxProps) => React.ReactNode;
    /** Custom render selected items */
    renderValue?: (values: V[], items: Option<V>[], selectedElement: React.ReactNode) => React.ReactNode;
}
/**
 * `TagPicker` component enables multi-selection by tags and supports new options.
 *
 * @see https://rsuitejs.com/components/tag-picker/
 */
declare const TagPicker: import("../internals/types").InternalRefForwardingComponent<"div", TagPickerProps<any>, never> & Record<string, never>;
export default TagPicker;
