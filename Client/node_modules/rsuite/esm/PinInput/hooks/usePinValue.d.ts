/**
 * Hook for managing pin input value
 * - Handles controlled/uncontrolled value
 * - Normalizes value to array format
 * - Manages array updates and modifications
 */
export declare const usePinValue: (controlValue: string | undefined, defaultValue: string, length: number, onChange?: ((value: string) => void) | undefined, onComplete?: ((value: string) => void) | undefined) => {
    value: string;
    valueArray: string[];
    setDigit: (index: number, digit: string) => void;
    clearDigit: (index: number) => void;
    updateValue: (newValue: string) => void;
};
export default usePinValue;
