/**
 * Clamp a value within min/max and handle NaN as empty string.
 */
export declare function clampValue(value: number | string, min?: number, max?: number): string;
export declare function decimals(...values: number[]): number;
/**
 * Disable the upper limit of the number.
 * @param value
 * @param max
 */
export declare function valueReachesMax(value: number | string | null | undefined, max: number): boolean;
/**
 * Disable the lower limit of the number.
 * @param value
 * @param min
 */
export declare function valueReachesMin(value: number | string | null | undefined, min: number): boolean;
