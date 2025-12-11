import React from 'react';
import type { Option, WithAsProps } from '../internals/types';
interface SearchViewProps<T> extends WithAsProps {
    searchKeyword: string;
    labelKey: string;
    valueKey: string;
    childrenKey: string;
    value: T[];
    data: Option<T>[];
    disabledItemValues: any[];
    cascade?: boolean;
    locale?: Record<string, string>;
    onSearch: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    onCheck: (item: Option<T>, event: React.SyntheticEvent, checked: boolean) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}
declare function SearchView<T>(props: SearchViewProps<T>): React.JSX.Element;
export default SearchView;
