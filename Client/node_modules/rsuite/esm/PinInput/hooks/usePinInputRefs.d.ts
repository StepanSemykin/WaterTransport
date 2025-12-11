/// <reference types="react" />
/**
 * A hook that manages the refs and focus behavior for a PIN input component
 */
export declare const usePinInputRefs: (length: number, autoFocus?: boolean) => {
    inputRefs: import("react").RefObject<(HTMLInputElement | null)[]>;
    focusInput: (index: number) => boolean;
    focusNextInput: (currentIndex: number) => boolean;
    focusPrevInput: (currentIndex: number) => boolean;
    getRefSetter: (index: number) => (el: HTMLInputElement | null) => void;
};
export default usePinInputRefs;
