import React from 'react';
export interface DialogContainerProps {
    children?: React.ReactNode;
}
export interface DialogContainerInstance {
    renderDialog: (dialog: React.ReactElement) => string | number;
    removeDialog: (key: string | number) => void;
    clearDialogs: () => void;
}
declare const DialogContainer: React.ForwardRefExoticComponent<DialogContainerProps & React.RefAttributes<DialogContainerInstance>>;
export default DialogContainer;
