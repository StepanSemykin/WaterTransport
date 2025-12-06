import type { ResponsiveValue } from '../../types';
/**
 * Generates responsive CSS class names based on the provided value and prefix function.
 * Handles both static and responsive values.
 *
 * @example
 * // With a single value
 * // getResponsiveClasses('rs-row', 'top');
 * // Returns: ['rs-row-top']
 *
 * @example
 * // With responsive values
 * // getResponsiveClasses('rs-row', { xs: 'top', md: 'bottom' });
 * // Returns: ['rs-row-xs-top', 'rs-row-md-bottom']
 *
 */
export declare const getResponsiveClasses: <T = string>(prefix: (...classes: any[]) => string, value?: T | ResponsiveValue<T> | undefined) => string[];
