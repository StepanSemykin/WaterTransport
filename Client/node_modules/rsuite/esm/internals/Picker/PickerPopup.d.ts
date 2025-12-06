import React from 'react';
import type { WithAsProps } from '../types';
import type { OverlayTriggerHandle } from '../Overlay';
export interface PickerPopupProps extends WithAsProps {
    placement?: string;
    autoWidth?: boolean;
    children?: React.ReactNode;
    target?: React.RefObject<OverlayTriggerHandle | null>;
    onKeyDown?: (event: React.KeyboardEvent) => void;
}
declare const PickerPopup: import("../types").InternalRefForwardingComponent<"div", PickerPopupProps, never> & Record<string, never>;
export default PickerPopup;
