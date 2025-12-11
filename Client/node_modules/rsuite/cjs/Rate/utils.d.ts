import type { StarStatus } from './types';
/**
 * Transforms a numeric value into a character map array.
 */
export declare const transformValueToStarStatus: (value: number, max: number, allowHalf: boolean) => StarStatus[];
/**
 * Transforms a character map array into a numeric value.
 */
export declare const transformStarStatusToValue: (characterMap: StarStatus[]) => number;
/**
 * Calculates the fractional part of a value as a percentage string.
 */
export declare const getFractionalValue: (value: number) => string | undefined;
export declare const getStarStatus: (status?: StarStatus) => any;
