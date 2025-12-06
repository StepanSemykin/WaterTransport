/**
 * Replaces the placement string with its polyfilled counterpart based on the given RTL (Right-to-Left) value.
 * @example
 * ```
 * placementPolyfill('bottomLeft');
 * // 'bottomStart'
 * ```
 */
export declare function placementPolyfill<T = string>(placement: T, rtl?: boolean): T;
/**
 * Converts a placement string to kebab-case and applies RTL polyfill if needed.
 * @example
 * ```
 * kebabPlace('bottomLeft');
 * // 'bottom-start'
 *
 * kebabPlace('topRight', true);
 * // 'top-start'
 * ```
 */
export declare function kebabPlace<T = string>(placement: T, rtl?: boolean): T;
