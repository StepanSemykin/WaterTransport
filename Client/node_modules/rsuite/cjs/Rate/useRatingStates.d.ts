/// <reference types="react" />
import type { StarStatus } from './types';
interface UseRatingStatesParams {
    value: number;
    max: number;
    allowHalf: boolean;
    valueProp?: number;
}
interface UseRatingStatesReturn {
    starStates: StarStatus[];
    hoverValue: number;
    setStarStates: React.Dispatch<React.SetStateAction<StarStatus[]>>;
    resetStarStates: () => void;
    getStarStates: (v?: number) => StarStatus[];
}
/**
 * Custom hook to manage rating star states for Rate component
 */
export declare const useRatingStates: ({ value, max, allowHalf, valueProp }: UseRatingStatesParams) => UseRatingStatesReturn;
export {};
