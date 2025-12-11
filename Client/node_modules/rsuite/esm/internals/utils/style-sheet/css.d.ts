/// <reference types="react" />
import type { StyleProperties } from '../../types';
/**
 * Processes and returns a value suitable for CSS (with a unit).
 */
export declare function getCssValue(value?: number | string | null, unit?: string): string | undefined;
/**
 * Merge multiple style objects, filtering out undefined values
 */
export declare function mergeStyles(...styles: (StyleProperties | undefined | null)[]): React.CSSProperties | undefined;
/**
 * Create CSS variables for offset positioning
 */
export declare function createOffsetStyles(offset?: [number | string, number | string], prefix?: string): React.CSSProperties | undefined;
/**
 * Check if a string is a valid CSS property name
 * @param prop - The property name to check
 * @returns True if the property is a valid CSS property
 */
export declare function isCSSProperty(prop: string): prop is Extract<keyof CSSStyleDeclaration, string>;
