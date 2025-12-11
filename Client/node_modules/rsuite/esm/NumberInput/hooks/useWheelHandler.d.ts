import { type RefObject } from 'react';
/**
 * Attach wheel listener to inputRef.
 */
export declare function useWheelHandler(inputRef: RefObject<HTMLInputElement | null>, handleWheel: (event: React.WheelEvent<HTMLInputElement>) => void, scrollable: boolean): void;
