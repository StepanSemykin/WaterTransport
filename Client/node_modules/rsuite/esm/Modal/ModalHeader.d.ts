import React from 'react';
import { BoxProps } from '../internals/Box';
export interface ModalHeaderProps extends BoxProps {
    /** Primary content */
    children?: React.ReactNode;
    /** Display close button */
    closeButton?: boolean;
    /** Called when Modal is hidden */
    onClose?: (event: React.MouseEvent) => void;
}
declare const ModalHeader: import("../internals/types").InternalRefForwardingComponent<"div", ModalHeaderProps, never> & Record<string, never>;
export default ModalHeader;
