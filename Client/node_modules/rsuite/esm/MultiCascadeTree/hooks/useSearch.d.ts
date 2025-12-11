/// <reference types="react" />
import type { Option } from '../../internals/types';
interface SearchPanelProps<T> {
    labelKey: string;
    valueKey: string;
    childrenKey: string;
    flattenedData: Option<T>[];
    uncheckableItemValues?: any[];
    onSearch?: (value: string, event: React.SyntheticEvent) => void;
}
declare function useSearch<T>(props: SearchPanelProps<T>): {
    searchKeyword: string;
    setSearchKeyword: import("react").Dispatch<import("react").SetStateAction<string>>;
    items: Option<T>[];
    handleSearch: (...args: any[]) => any;
};
export default useSearch;
