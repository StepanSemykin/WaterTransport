'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Transition from "./Transition.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * Slide animation component
 * @see https://rsuitejs.com/components/animation/#slide
 */
const Slide = /*#__PURE__*/React.forwardRef(({
  timeout = 300,
  placement = 'right',
  ...props
}, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Slide', props);
  const {
    prefix
  } = useStyles('anim');
  const enterClassName = prefix('slide-in', placement);
  const exitClassName = prefix('slide-out', placement);
  return /*#__PURE__*/React.createElement(Transition, _extends({}, propsWithDefaults, {
    ref: ref,
    animation: true,
    timeout: timeout,
    enteringClassName: enterClassName,
    enteredClassName: enterClassName,
    exitingClassName: exitClassName,
    exitedClassName: exitClassName
  }));
});
Slide.displayName = 'Slide';
export default Slide;