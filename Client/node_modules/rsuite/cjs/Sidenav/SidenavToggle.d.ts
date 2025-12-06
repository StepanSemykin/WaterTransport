import React from 'react';
import { IconButtonProps } from '../IconButton';
export interface SidenavToggleProps extends IconButtonProps {
    /** Callback function for menu state switching */
    onToggle?: (expanded: boolean, event: React.MouseEvent) => void;
}
declare const SidenavToggle: import("../internals/types").InternalRefForwardingComponent<"div", SidenavToggleProps, never> & Record<string, never>;
export default SidenavToggle;
