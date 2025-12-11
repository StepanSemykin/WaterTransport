import React from 'react';
import { ButtonProps } from '../Button';
import type { UploaderLocale } from '../locales';
export interface UploadTriggerProps extends ButtonProps {
    children?: React.ReactElement<any>;
    className?: string;
    disabled?: boolean;
    name?: string;
    multiple?: boolean;
    readOnly?: boolean;
    draggable?: boolean;
    accept?: string;
    locale?: UploaderLocale;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    onDragEnter?: React.DragEventHandler<HTMLInputElement>;
    onDragLeave?: React.DragEventHandler<HTMLInputElement>;
    onDragOver?: React.DragEventHandler<HTMLInputElement>;
    onDrop?: React.DragEventHandler<HTMLInputElement>;
}
export interface UploadTriggerInstance {
    clearInput: () => void;
}
declare const UploadTrigger: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", ButtonProps, never> & Record<string, never>, UploadTriggerProps, never> & Record<string, never>;
export default UploadTrigger;
