'use client';
import React from 'react';

/**
 * Returns the type of the given object.
 * @param object - The object to check.
 * @returns The type of the object.
 */
function typeOf(object) {
  if (typeof object === 'object' && object !== null) {
    return object.type || object.$$typeof;
  }
}

/**
 * Checks if the given children is a React fragment.
 * @param children - The children to check.
 * @returns True if the children is a React fragment, false otherwise.
 */
export function isFragment(children) {
  return React.Children.count(children) === 1 && typeOf(children) === Symbol.for('react.fragment');
}