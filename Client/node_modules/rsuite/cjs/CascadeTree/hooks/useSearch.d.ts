/// <reference types="react" />
import { Option } from '../../internals/types';
interface SearchPanelProps<T> {
    labelKey: string;
    childrenKey: string;
    parentMap: WeakMap<Option<T>, Option<T>>;
    flattenedData: Option<T>[];
    parentSelectable?: boolean;
    onSearch: (value: string, items: Option<T>[], event: React.SyntheticEvent) => void;
}
declare function useSearch<T>(props: SearchPanelProps<T>): {
    searchKeyword: string;
    setSearchKeyword: import("react").Dispatch<import("react").SetStateAction<string>>;
    items: Option<T>[];
    handleSearch: (...args: any[]) => any;
};
export default useSearch;
