'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Transition from "./Transition.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
/**
 * Bounce animation component
 * @see https://rsuitejs.com/components/animation/#bounce
 */
const Bounce = /*#__PURE__*/React.forwardRef(({
  timeout = 300,
  ...props
}, ref) => {
  const {
    prefix
  } = useStyles('anim');
  const {
    propsWithDefaults
  } = useCustom('Bounce', props);
  return /*#__PURE__*/React.createElement(Transition, _extends({}, propsWithDefaults, {
    ref: ref,
    animation: true,
    timeout: timeout,
    enteringClassName: prefix('bounce-in'),
    enteredClassName: prefix('bounce-in'),
    exitingClassName: prefix('bounce-out'),
    exitedClassName: prefix('bounce-out')
  }));
});
Bounce.displayName = 'Bounce';
export default Bounce;