export interface UseNumberInputValueParams {
    value?: number | string | null;
    isFocused: boolean;
    formatter?: (value: number | string) => string;
    decimalSeparator?: string;
}
export declare function useNumberInputValue(params: UseNumberInputValueParams): string | number;
