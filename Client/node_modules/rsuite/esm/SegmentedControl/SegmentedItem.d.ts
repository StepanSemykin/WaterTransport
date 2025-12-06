import React from 'react';
import { SegmentedItemDataType } from './SegmentedControl';
export interface SegmentedItemProps {
    item: SegmentedItemDataType;
    index: number;
    name?: string;
    active: boolean;
    disabled?: boolean;
    classPrefix: string;
    onChange: (value: string | number, event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const SegmentedItem: {
    ({ item, index, name, active, disabled, classPrefix, onChange }: SegmentedItemProps): React.JSX.Element;
    displayName: string;
};
export default SegmentedItem;
