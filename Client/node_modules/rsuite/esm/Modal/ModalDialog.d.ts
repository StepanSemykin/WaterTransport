import React from 'react';
import { BoxProps } from '../internals/Box';
import type { Size } from '../internals/types';
export interface ModalDialogProps extends BoxProps {
    /** A modal can have different sizes */
    size?: Size;
    dialogClassName?: string;
    dialogStyle?: React.CSSProperties;
}
declare const ModalDialog: import("../internals/types").InternalRefForwardingComponent<"div", ModalDialogProps, never> & Record<string, never>;
export default ModalDialog;
