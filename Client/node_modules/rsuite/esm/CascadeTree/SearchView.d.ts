import React from 'react';
import { Option, WithAsProps } from '../internals/types';
interface SearchViewProps<T> extends WithAsProps {
    searchKeyword: string;
    labelKey: string;
    valueKey: string;
    parentMap: WeakMap<Option<T>, Option<T>>;
    data: Option<T>[];
    focusItemValue?: T | null;
    disabledItemValues: any[];
    locale?: Record<string, string>;
    renderSearchItem?: (label: React.ReactNode, items: Option<T>[]) => React.ReactNode;
    onSelect: (item: Option<T>, items: Option<T>[], event: React.MouseEvent) => void;
    onSearch: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void;
    inputRef?: React.RefObject<HTMLInputElement | null>;
}
declare function SearchView<T>(props: SearchViewProps<T>): React.JSX.Element;
export default SearchView;
