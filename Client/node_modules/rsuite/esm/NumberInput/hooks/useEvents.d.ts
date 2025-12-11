/// <reference types="react" />
export interface UseEventsParams {
    value?: number | string | null;
    scrollable: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    min?: number;
    max?: number;
    step?: number;
    decimalSeparator?: string;
    onChangeValue: (currentValue: number | string, event: React.SyntheticEvent) => void;
    onWheel?: (event: React.WheelEvent<HTMLInputElement>) => void;
}
export declare function useEvents(params: UseEventsParams): {
    inputRef: import("react").RefObject<HTMLInputElement | null>;
    isFocused: boolean;
    onStepUp: (...args: any[]) => any;
    onStepDown: (...args: any[]) => any;
    onKeyDown: (...args: any[]) => any;
    onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
    onFocus: () => void;
};
