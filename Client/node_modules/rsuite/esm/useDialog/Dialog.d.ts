import React from 'react';
import { ModalProps } from '../Modal';
export interface DialogProps extends ModalProps {
    type: 'alert' | 'confirm' | 'prompt';
    title?: React.ReactNode;
    content?: React.ReactNode;
    okText?: string;
    cancelText?: string;
    severity?: 'info' | 'success' | 'warning' | 'error';
    defaultValue?: string;
    validate?: (value: string) => [isValid: boolean, errorMessage?: string];
    onClose?: (result?: any) => void;
}
declare const Dialog: import("../internals/types").InternalRefForwardingComponent<React.ElementType<any, keyof React.JSX.IntrinsicElements>, DialogProps, never> & Record<string, never>;
export default Dialog;
