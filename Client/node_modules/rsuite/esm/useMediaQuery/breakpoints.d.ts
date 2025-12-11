import type { BreakpointMap, BreakpointSystem } from './types';
/**
 * Create breakpoint system
 *
 * This function takes a breakpoint map with numeric values and returns an enhanced breakpoint system
 * that provides various media queries for responsive design.
 *
 * @example
 * ```ts
 * const breakpoints = createBreakpoints({
 *   xs: 0,
 *   sm: 576,
 *   md: 768,
 *   lg: 992,
 *   xl: 1200
 * });
 *
 * // Using breakpoints
 * breakpoints.up('md'); // '(min-width: 768px)'
 * breakpoints.down('lg'); // '(max-width: 991.99px)'
 * breakpoints.between('sm', 'lg'); // '(min-width: 576px) and (max-width: 991.99px)'
 * ```
 */
export declare function createBreakpoints(breakpoints: BreakpointMap): BreakpointSystem;
