'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Transition from "./Transition.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * Fade animation component
 * @see https://rsuitejs.com/components/animation/#fade
 */
const Fade = /*#__PURE__*/React.forwardRef(({
  timeout = 300,
  className,
  ...props
}, ref) => {
  const {
    prefix,
    merge
  } = useStyles('anim');
  const {
    propsWithDefaults
  } = useCustom('Fade', props);
  return /*#__PURE__*/React.createElement(Transition, _extends({}, propsWithDefaults, {
    ref: ref,
    timeout: timeout,
    className: merge(className, prefix('fade')),
    enteredClassName: prefix('in'),
    enteringClassName: prefix('in')
  }));
});
Fade.displayName = 'Fade';
export default Fade;