import React from 'react';
import { DrawerProps } from '../../Drawer';
import type { OverlayTriggerProps } from '../Overlay/OverlayTrigger';
export interface PickerDrawerProps extends DrawerProps {
    speaker: OverlayTriggerProps['speaker'];
}
export declare const PickerDrawer: React.ForwardRefExoticComponent<PickerDrawerProps & React.RefAttributes<any>>;
export default PickerDrawer;
