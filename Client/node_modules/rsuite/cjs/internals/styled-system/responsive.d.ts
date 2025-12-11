import type { Breakpoints, ResponsiveValue, WithResponsive } from '../types';
/**
 * Breakpoint values in pixels - matching SCSS variables
 * These values are used for responsive design across the application.
 * They follow a mobile-first approach where 'xs' is the base breakpoint.
 */
export declare const breakpointValues: Record<Breakpoints, number>;
/**
 * Checks if a value is a responsive value object
 * @param value - Value to check
 * @returns True if the value is a responsive value object
 */
export declare function isResponsiveValue(value: any): value is ResponsiveValue<any>;
/**
 * Process a value that might be a responsive value
 * @param value - Value to process
 * @param processor - Function to process non-responsive values
 * @returns Processed value or responsive object with processed values
 */
export declare function processResponsiveValue<T, R extends string | number | undefined>(value: T | ResponsiveValue<T> | undefined, processor: (val: T) => R): R | ResponsiveValue<R> | undefined;
type CSSVarValue = WithResponsive<string | number | undefined>;
/**
 * Converts layout properties to CSS variables with abbreviated names
 */
export declare const getCSSVariables: (props: Record<string, any>, prefix?: string) => Record<string, CSSVarValue>;
export {};
