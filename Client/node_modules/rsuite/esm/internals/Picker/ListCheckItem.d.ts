import React from 'react';
import { CheckboxProps } from '../../Checkbox';
import type { WithAsProps, PropsWithoutSelect } from '../types';
export interface ListCheckItemProps extends WithAsProps, PropsWithoutSelect<CheckboxProps> {
    active?: boolean;
    checkboxAs?: React.ElementType | string;
    focus?: boolean;
    onSelect?: (value: any, event: React.SyntheticEvent, checked: boolean) => void;
    onCheck?: (value: any, event: React.SyntheticEvent, checked: boolean) => void;
    onSelectItem?: (value: any, event: React.SyntheticEvent, checked: boolean) => void;
    renderCheckbox?: (checkboxProps: CheckboxProps) => React.ReactNode;
}
declare const ListCheckItem: import("../types").InternalRefForwardingComponent<"div", ListCheckItemProps, never> & Record<string, never>;
export default ListCheckItem;
