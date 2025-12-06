import React from 'react';
import type { WithAsProps, HTMLPropsWithoutChange } from '../internals/types';
export interface InputSearchProps extends WithAsProps, HTMLPropsWithoutChange<HTMLInputElement> {
    readOnly?: boolean;
    value?: string;
    inputStyle?: React.CSSProperties;
    inputRef?: React.Ref<any>;
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const InputSearch: import("../internals/types").InternalRefForwardingComponent<"input", InputSearchProps, never> & Record<string, never>;
export default InputSearch;
