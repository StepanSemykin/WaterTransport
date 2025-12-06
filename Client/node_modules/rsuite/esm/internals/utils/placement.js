'use client';
import kebabCase from 'lodash/kebabCase';

/**
 * Replaces the placement string with its polyfilled counterpart based on the given RTL (Right-to-Left) value.
 * @example
 * ```
 * placementPolyfill('bottomLeft');
 * // 'bottomStart'
 * ```
 */
export function placementPolyfill(placement, rtl = false) {
  if (typeof placement === 'string') {
    if (rtl) {
      placement = placement.replace(/left|right/, m => m === 'left' ? 'right' : 'left');
    }
    return placement.replace(/Left|Top/, 'Start').replace(/Right|Bottom/, 'End');
  }
  return placement;
}

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
export function kebabPlace(placement, rtl) {
  if (typeof placement === 'string') {
    return kebabCase(placementPolyfill(placement, rtl));
  }
  return placement;
}