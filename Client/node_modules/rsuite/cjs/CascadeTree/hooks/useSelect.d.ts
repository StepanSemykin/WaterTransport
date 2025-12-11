/// <reference types="react" />
import type { Option } from '../../internals/types';
import type { SelectNode } from '../types';
export interface UseSelectProps<T> {
    value?: T | null;
    valueKey: string;
    childrenKey: string;
    selectedItem?: Option<T>;
    childrenMap: any;
    onSelect?: (node: SelectNode<T>, event: React.SyntheticEvent) => void;
    onChange?: (value: T, event: React.SyntheticEvent) => void;
    getChildren?: (node: Option<T>) => readonly Option<T>[] | Promise<readonly Option<T>[]>;
}
/**
 * Hook for handling the state after the option is selected
 */
declare const useSelect: <T>(props: UseSelectProps<T>) => {
    loadingItemsSet: any;
    activeItem: Option<T> | undefined;
    setActiveItem: import("react").Dispatch<import("react").SetStateAction<Option<T> | undefined>>;
    handleSelect: (...args: any[]) => any;
};
export default useSelect;
