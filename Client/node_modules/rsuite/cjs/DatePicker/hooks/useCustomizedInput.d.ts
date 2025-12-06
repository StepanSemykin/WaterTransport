/// <reference types="react" />
interface UseCustomizedInputProps<T> {
    value?: T | null;
    formatStr: string;
    readOnly?: boolean;
    editable?: boolean;
    loading?: boolean;
    mode?: 'date' | 'dateRange';
    renderValue?: (value: T, format: string) => string;
}
declare function useCustomizedInput<T>(props: UseCustomizedInputProps<T>): {
    customValue: string | null;
    Input: (import("../../internals/types").InternalRefForwardingComponent<"input", import("../../Input").InputProps, never> & Record<string, never>) | (import("../../internals/types").InternalRefForwardingComponent<import("../../internals/types").InternalRefForwardingComponent<"input", import("../../Input").InputProps, never> & Record<string, never>, import("../../DateInput").DateInputProps, never> & Record<string, never>) | import("react").ForwardRefExoticComponent<import("../../DateRangeInput").DateRangeInputProps & import("react").RefAttributes<unknown>>;
    inputReadOnly: boolean;
    events: {
        onActive: () => void;
        onInactive: () => void;
    };
};
export default useCustomizedInput;
