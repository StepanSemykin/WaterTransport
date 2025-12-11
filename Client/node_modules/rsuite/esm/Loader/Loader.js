'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useUniqueId } from "../internals/hooks/index.js";
/**
 * The `Loader` component is used to indicate the loading state of a page or a section.
 * @see https://rsuitejs.com/components/loader
 */
const Loader = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Loader', props);
  const {
    as,
    classPrefix = 'loader',
    className,
    inverse,
    backdrop,
    speed = 'normal',
    center,
    vertical,
    content,
    size = 'sm',
    ...rest
  } = propsWithDefaults;
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const labelId = useUniqueId('loader-label-');
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "status",
    "aria-labelledby": content ? labelId : undefined,
    ref: ref,
    className: classes,
    "data-size": size,
    "data-speed": speed,
    "data-center": backdrop || center,
    "data-direction": vertical ? 'vertical' : 'horizontal',
    "data-inverse": inverse
  }, rest), backdrop && /*#__PURE__*/React.createElement("div", {
    className: prefix('backdrop')
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix('box')
  }, /*#__PURE__*/React.createElement("span", {
    className: prefix('spin')
  }), content && /*#__PURE__*/React.createElement("span", {
    id: labelId,
    className: prefix('content')
  }, content)));
});
Loader.displayName = 'Loader';
export default Loader;