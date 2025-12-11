/// <reference types="react" />
import type { Option } from '../../internals/types';
export interface InputOption<T = number | string> extends Option<T> {
    create?: boolean;
}
interface UseDataProps {
    controlledData?: InputOption[];
    cacheData?: InputOption[];
    onChange?: (data: Option[]) => void;
}
declare function useData(props: UseDataProps): {
    data: Option<string | number>[];
    dataWithCache: Option<string | number>[];
    newData: InputOption<string | number>[];
    setNewData: import("react").Dispatch<import("react").SetStateAction<InputOption<string | number>[]>>;
};
export default useData;
