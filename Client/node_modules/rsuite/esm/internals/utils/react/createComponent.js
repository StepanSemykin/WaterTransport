'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import kebabCase from 'lodash/kebabCase';
import Box from "../../Box/Box.js";
import { forwardRef } from "./forwardRef.js";
/**
 * Why not import like this:
 * ```
 * import { useStyles, useCustom } from '../../hooks/index.js';
 * ```
 *
 * We import useStyles and useCustom separately to prevent Vite from displaying Rollup warnings
 * during the build process. This approach avoids circular dependency issues that could affect
 * chunk division and optimizes the build output.
 */
import { useStyles } from "../../hooks/useStyles.js";
import { useCustom } from "../../hooks/useCustom.js";
/**
 * Create a component with `classPrefix` and `as` attributes.
 * By default, the component is based on Box component and inherits all Box props.
 */
export function createComponent({
  name,
  componentAs,
  componentClassPrefix,
  ...defaultProps
}) {
  const Component = forwardRef((props, ref) => {
    const {
      propsWithDefaults
    } = useCustom(name, props);
    const {
      as,
      classPrefix = componentClassPrefix || kebabCase(name),
      className,
      role,
      ...rest
    } = propsWithDefaults;
    const {
      withPrefix,
      merge
    } = useStyles(classPrefix);
    const classes = merge(className, withPrefix());
    return /*#__PURE__*/React.createElement(Box, _extends({}, defaultProps, rest, {
      role: role,
      ref: ref,
      className: classes,
      as: as || componentAs || 'div'
    }));
  });
  Component.displayName = name;
  return Component;
}
export default createComponent;