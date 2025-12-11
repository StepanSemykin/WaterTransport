'use client';
import classNames from 'classnames';
import { useCallback, useContext } from 'react';
import { createStyleGetter, prefix as addPrefix, getResponsiveClasses } from "../utils/index.js";
import { CustomContext } from "../Provider/CustomContext.js";

// This is the only way I found to break circular references between ClassArray and ClassValue
// https://github.com/Microsoft/TypeScript/issues/3496#issuecomment-128553540

/**
 * Add a prefix to all classNames.
 *
 * @param str prefix of className
 * @returns { withPrefix, merge, prefix }
 *  - withPrefix: A function of combining className and adding a prefix to each className.
 *    At the same time, the default `classPrefix` is the first className.
 *  - merge: A merge className function.
 *  - prefix: Add a prefix to className
 *  - rootPrefix
 */
export function useStyles(str) {
  const {
    classPrefix = 'rs'
  } = useContext(CustomContext) || {};
  const baseClass = addPrefix(classPrefix, str);

  /**
   * @example
   *
   * if str = 'button':
   * prefix('red', { active: true }) => 'rs-button-red rs-button-active'
   */
  const prefix = useCallback((...classes) => {
    const mergeClasses = classes.length ? classNames(...classes).split(' ').map(item => addPrefix(baseClass, item)) : [];
    return mergeClasses.filter(cls => cls).join(' ');
  }, [baseClass]);

  /**
   * @example
   *
   * if str = 'button':
   * withPrefix('red', { active: true }) => 'rs-button rs-button-red rs-button-active'
   */
  const withPrefix = useCallback((...classes) => {
    const mergeClasses = prefix(classes);
    return mergeClasses ? `${baseClass} ${mergeClasses}` : baseClass;
  }, [baseClass, prefix]);

  /**
   * @example
   * rootPrefix('btn') => 'rs-btn'
   * rootPrefix('btn', { active: true }) => 'rs-btn rs-active'
   */
  const rootPrefix = (...classes) => {
    const mergeClasses = classes.length ? classNames(...classes).split(' ').map(item => addPrefix(classPrefix, item)) : [];
    return mergeClasses.filter(cls => cls).join(' ');
  };
  const cssVar = useCallback((prop, value, valueTransformer) => {
    if (typeof value === 'undefined') {
      return;
    }
    return createStyleGetter({
      prop,
      valueTransformer
    })(value, str, prop);
  }, [str]);
  const responsive = useCallback(value => {
    if (!value) return [];
    return getResponsiveClasses(prefix, value);
  }, [prefix]);
  return {
    cssVar,
    withPrefix,
    prefix,
    responsive,
    rootPrefix,
    merge: classNames
  };
}
export default useStyles;