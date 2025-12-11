'use client';
"use strict";

exports.__esModule = true;
exports.generateStackCssVars = generateStackCssVars;
var _utils = require("../internals/utils");
/**
 * Generate CSS variables for Stack component
 */
function generateStackCssVars({
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
      cssVars[`${prefix}spacing`] = spacing.map(s => (0, _utils.getCssValue)(s)).join(' ');
    } else {
      cssVars[`${prefix}spacing`] = (0, _utils.getCssValue)(spacing);
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