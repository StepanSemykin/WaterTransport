'use client';
import { getCssValue } from "../internals/utils/index.js";

/**
 * Generate CSS variables for Stack component
 */
export function generateStackCssVars({
  spacing,
  align,
  justify
}) {
  const cssVars = {};
  const prefix = `--rs-stack-`;

  // Add spacing CSS variable
  if (spacing !== undefined) {
    // Handle array or single value for spacing
    if (Array.isArray(spacing)) {
      cssVars[`${prefix}spacing`] = spacing.map(s => getCssValue(s)).join(' ');
    } else {
      cssVars[`${prefix}spacing`] = getCssValue(spacing);
    }
  }

  // Add align CSS variable
  if (align !== undefined) {
    cssVars[`${prefix}align`] = align;
  }

  // Add justify CSS variable
  if (justify !== undefined) {
    cssVars[`${prefix}justify`] = justify;
  }
  return cssVars;
}