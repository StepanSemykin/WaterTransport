import React from 'react';
import type { AlertOptions, ConfirmOptions, OpenOptions, PromptOptions } from './types';
/**
 * A hook that provides methods to show dialogs.
 * @see https://rsuitejs.com/components/use-dialog
 */
export declare function useDialog(): {
    alert: (message: React.ReactNode, options?: AlertOptions) => Promise<any>;
    confirm: (message: React.ReactNode, options?: ConfirmOptions) => Promise<any>;
    prompt: (message: React.ReactNode, options?: PromptOptions) => Promise<any>;
    open: <P extends object>(as: React.ComponentType<P & {
        onClose: (result?: any) => void;
    }>, payload?: P | undefined, options?: OpenOptions) => Promise<any>;
};
export default useDialog;
