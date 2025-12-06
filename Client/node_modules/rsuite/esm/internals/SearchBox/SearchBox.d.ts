import React from 'react';
import type { WithAsProps } from '../types';
export interface SearchBoxProps extends WithAsProps {
    value?: string;
    placeholder?: string;
    className?: string;
    inputRef?: React.Ref<HTMLInputElement>;
    onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
}
declare const SearchBox: import("../types").InternalRefForwardingComponent<"div", SearchBoxProps, never> & Record<string, never>;
export default SearchBox;
