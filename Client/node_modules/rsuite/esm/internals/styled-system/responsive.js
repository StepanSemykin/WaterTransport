'use client';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import { getCssValue, isCSSProperty } from "../utils/index.js";
import { BREAKPOINTS } from "../constants/index.js";
import { cssSystemPropAlias } from "./css-alias.js";
/**
 * Breakpoint values in pixels - matching SCSS variables
 * These values are used for responsive design across the application.
 * They follow a mobile-first approach where 'xs' is the base breakpoint.
 */
export const breakpointValues = {
  xs: 0,
  // Base mobile first
  sm: 576,
  // $screen-sm
  md: 768,
  // $screen-md
  lg: 992,
  // $screen-lg
  xl: 1200,
  // $screen-xl
  xxl: 1400,
  // $screen-xxl
  '2xl': 1400 // Alias for xxl for compatibility
};

/**
 * Checks if a value is a responsive value object
 * @param value - Value to check
 * @returns True if the value is a responsive value object
 */
export function isResponsiveValue(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).some(key => BREAKPOINTS.includes(key));
}

/**
 * Process a value that might be a responsive value
 * @param value - Value to process
 * @param processor - Function to process non-responsive values
 * @returns Processed value or responsive object with processed values
 */
export function processResponsiveValue(value, processor) {
  if (value === undefined) {
    return undefined;
  }
  if (isResponsiveValue(value)) {
    const result = {};
    Object.entries(value).forEach(([breakpoint, val]) => {
      if (val !== undefined) {
        const processed = processor(val);
        if (processed !== undefined) {
          result[breakpoint] = processed;
        }
      }
    });
    return Object.keys(result).length > 0 ? result : undefined;
  }
  return processor(value);
}

// Type for CSS variable values that can be string, number, or responsive values

const transformCSSValue = (value, type) => {
  if (type === 'number') {
    return value;
  }
  return getCssValue(value);
};

/**
 * Converts layout properties to CSS variables with abbreviated names
 */
export const getCSSVariables = (props, prefix = `--rs-`) => {
  const cssVars = {};
  const cssVar = name => `${prefix}${kebabCase(name)}`;
  const getCSSProperty = name => {
    let cssName = name;
    let cssProp = cssSystemPropAlias[name];
    if (!cssProp) {
      Object.entries(cssSystemPropAlias).forEach(([key, prop]) => {
        if (camelCase(prop.property) === name) {
          cssProp = prop;
          cssName = key;
        }
      });
    }
    return [cssName, cssProp];
  };
  Object.entries(props).forEach(([name, value]) => {
    if (typeof value === 'undefined') {
      return;
    }
    const [cssName, cssProp] = getCSSProperty(name);
    const varName = cssVar(cssName);
    if (cssProp) {
      const {
        transformer,
        type
      } = cssProp;
      cssVars[varName] = processResponsiveValue(value, val => {
        return transformer ? transformer(val) : transformCSSValue(val, type);
      });
    } else if (isCSSProperty(cssName)) {
      // For non-predefined CSS properties, directly process with getCssValue
      cssVars[varName] = processResponsiveValue(value, val => getCssValue(val));
    }
  });
  return cssVars;
};