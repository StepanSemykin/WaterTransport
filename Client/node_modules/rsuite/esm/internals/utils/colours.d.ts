import { Color } from '../types/colours';
/**
 * Checks if a color value matches the pattern like 'red', 'gray.50', etc.,
 * and returns the appropriate CSS variable format.
 * @param color The color value to check
 * @returns The CSS variable if it's a valid color type, or the original value
 */
export declare const getColorValue: (color: Color | string | undefined) => string | undefined;
export declare const isPresetColor: (color?: Color | React.CSSProperties['color']) => boolean;
export declare const getColorStyle: (value?: import("csstype").Property.Color | undefined, name?: string | undefined, prop?: string) => {
    [x: string]: string | (string & {}) | undefined;
} | undefined;
/**
 * Convert short hex color to full hex color
 * e.g. #fff -> #ffffff
 */
export declare const expandHexColor: (color: string) => string;
/**
 * Calculate relative luminance of a color
 * Using the formula from WCAG 2.0
 */
export declare const getLuminance: (color: string) => number;
/**
 * Get contrasting text color (black or white) based on background color
 */
export declare const getContrastText: (bgColor: string) => string;
/**
 * Create CSS color variables for custom colors
 * Returns background and optional text color variables
 */
export declare const createColorVariables: (color?: Color | React.CSSProperties['color'], bgFieldName?: string, textFieldName?: string) => React.CSSProperties | undefined;
