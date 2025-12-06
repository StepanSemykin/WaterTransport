import React from 'react';
import type { Option } from '../../internals/types';
export interface UseSelectProps<T> {
    data: Option<T>[];
    childrenKey: string;
    labelKey: string;
    valueKey: string;
    onSelect?: (node: Option<T>, cascadePaths: Option<T>[], event: React.SyntheticEvent) => void;
    getChildren?: (node: Option<T>) => Option<T>[] | Promise<Option<T>[]>;
}
declare const useSelect: <T>(props: UseSelectProps<T>) => {
    columnData: (readonly Option<T>[])[];
    setColumnData: React.Dispatch<React.SetStateAction<(readonly Option<T>[])[]>>;
    flattenData: Option<T>[];
    selectedPaths: Option<T>[] | undefined;
    setSelectedPaths: React.Dispatch<React.SetStateAction<Option<T>[] | undefined>>;
    handleSelect: (...args: any[]) => any;
};
export default useSelect;
