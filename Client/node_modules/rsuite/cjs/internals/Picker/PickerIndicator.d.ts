import React from 'react';
import type { Size } from '../types';
interface PickerIndicatorProps {
    loading?: boolean;
    caretAs?: React.ElementType | null;
    onClose?: (event: React.MouseEvent<HTMLElement>) => void;
    showCleanButton?: boolean;
    disabled?: boolean;
    size?: Size;
    as?: React.ElementType;
}
declare const PickerIndicator: ({ loading, caretAs, onClose, showCleanButton, as: Component, disabled, size }: PickerIndicatorProps) => React.JSX.Element;
export default PickerIndicator;
