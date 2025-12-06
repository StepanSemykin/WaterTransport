import React from 'react';
import { PickerLocale } from '../../locales';
import type { Size } from '../types';
export interface SelectedElementProps {
    badgeSize?: Size;
    selectedItems: any[];
    valueKey: string;
    labelKey: string;
    countable: boolean;
    cascade?: boolean;
    locale?: Partial<PickerLocale>;
    childrenKey?: string;
    prefix: (name: string) => string;
}
declare const SelectedElement: (props: SelectedElementProps) => React.JSX.Element;
export default SelectedElement;
