'use client';
import isPlainObject from 'lodash/isPlainObject';
import { BREAKPOINTS } from "../../internals/constants/index.js";
import { mergeStyles, getCssValue } from "../../internals/utils/index.js";
/**
 * Generates CSS variable styles for grid gutters, supporting both single values and arrays [horizontal, vertical]
 */
export const getResponsiveGutterStyles = gutter => {
  if (typeof gutter === 'undefined') {
    return {};
  }

  // Helper function to process gutter values and generate CSS variables
  const processGutterValue = (value, prefix = '') => {
    const [h, v] = Array.isArray(value) ? value : [value, value];
    return {
      [`--rs-grid-gutter${prefix}`]: getCssValue(h),
      [`--rs-grid-row-gutter${prefix}`]: getCssValue(v)
    };
  };

  // Handle responsive object
  if (isPlainObject(gutter)) {
    return BREAKPOINTS.reduce((styles, breakpoint) => {
      const value = gutter[breakpoint];
      if (!value) return styles;
      const prefix = breakpoint === 'xs' ? '' : `-${breakpoint}`;
      return mergeStyles(styles, processGutterValue(value, prefix));
    }, {});
  }

  // Handle non-responsive value
  return processGutterValue(gutter);
};