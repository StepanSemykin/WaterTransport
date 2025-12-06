'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Heading from "../Heading/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * The `Popover` component is used to display a popup window for a target component.
 * @see https://rsuitejs.com/components/popover
 */
const Popover = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Popover', props);
  const {
    as,
    classPrefix = 'popover',
    title,
    children,
    style,
    visible,
    className,
    full,
    arrow = true,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    full
  }));
  const styles = useMemo(() => mergeStyles(style, {
    ['--rs-opacity']: visible ? 1 : undefined
  }), [visible, style]);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "dialog",
    ref: ref,
    className: classes,
    style: styles
  }, rest), arrow && /*#__PURE__*/React.createElement("div", {
    className: prefix`arrow`,
    "aria-hidden": true
  }), title && /*#__PURE__*/React.createElement(Heading, {
    level: 3,
    className: prefix`title`
  }, title), /*#__PURE__*/React.createElement("div", {
    className: prefix`content`
  }, children));
});
Popover.displayName = 'Popover';
export default Popover;