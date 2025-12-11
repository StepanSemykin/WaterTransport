'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import omit from 'lodash/omit';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { BREAKPOINTS } from "../internals/constants/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The `Col` component is used for layout and grids.
 * @see https://rsuitejs.com/en/components/grid
 */
const Col = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Col', props);
  const {
    as,
    classPrefix = 'col',
    className,
    span,
    offset,
    push,
    pull,
    order,
    hidden,
    ...rest
  } = propsWithDefaults;
  const {
    prefix,
    merge,
    rootPrefix,
    withPrefix
  } = useStyles(classPrefix);
  const {
    colClasses,
    omitKeys
  } = useMemo(() => {
    const colClasses = {};
    const omitKeys = {};
    const addResponsiveClasses = (size, value, type) => {
      if (value === undefined) return;
      if (type === 'span' && value === 'auto') {
        colClasses[prefix(`auto-${size}`)] = true;
        return;
      }
      const classKey = type === 'hidden' ? rootPrefix(`hidden-${size}`) : prefix(`${size}-${type === 'span' ? '' : type + '-'}${value}`);
      colClasses[classKey] = type === 'hidden' ? Boolean(value) : Number(value) >= 0;
    };

    // Handle new responsive props format
    const resolve = (propValue, type) => {
      if (propValue === undefined) return;
      if (typeof propValue === 'object') {
        // Handle responsive object format
        BREAKPOINTS.forEach(size => {
          const value = propValue[size];
          if (value !== undefined) {
            addResponsiveClasses(size, value, type);
          }
        });
      } else {
        // Handle single value format (applies to xs)
        addResponsiveClasses('xs', propValue, type);
      }
    };

    // Process new format props
    resolve(span, 'span');
    resolve(offset, 'offset');
    resolve(push, 'push');
    resolve(pull, 'pull');
    resolve(order, 'order');
    resolve(hidden, 'hidden');

    // Handle legacy format props
    BREAKPOINTS.forEach(size => {
      const value = rest[size];
      omitKeys[size] = null;
      if (typeof value === 'number') {
        addResponsiveClasses(size, value, 'span');
      }

      // Handle legacy props
      ['Offset', 'Push', 'Pull', 'Hidden'].forEach(type => {
        const legacyKey = `${size}${type}`;
        const legacyValue = rest[legacyKey];
        omitKeys[legacyKey] = null;
        if (legacyValue !== undefined) {
          addResponsiveClasses(size, legacyValue, type.toLowerCase());
        }
      });
    });
    return {
      colClasses,
      omitKeys
    };
  }, [prefix, rootPrefix, span, offset, push, pull, order, hidden, ...BREAKPOINTS.map(size => rest[size])]);
  const classes = merge(className, withPrefix(), colClasses);
  const unhandledProps = omit(rest, Object.keys(omitKeys));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, unhandledProps, {
    ref: ref,
    className: classes
  }));
});
Col.displayName = 'Col';
export default Col;