'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback } from 'react';
import getStyle from 'dom-lib/getStyle';
import addStyle from 'dom-lib/addStyle';
import get from 'lodash/get';
import capitalize from 'lodash/capitalize';
import Transition from "./Transition.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { createChainedFunction } from "../internals/utils/index.js";
export let DIMENSION = /*#__PURE__*/function (DIMENSION) {
  DIMENSION["HEIGHT"] = "height";
  DIMENSION["WIDTH"] = "width";
  return DIMENSION;
}({});
const triggerBrowserReflow = node => get(node, 'offsetHeight');
const MARGINS = {
  height: ['marginTop', 'marginBottom'],
  width: ['marginLeft', 'marginRight']
};
function defaultGetDimensionValue(dimension, elem) {
  var _get;
  const value = (_get = get(elem, `offset${capitalize(dimension)}`)) !== null && _get !== void 0 ? _get : 0;
  const margins = MARGINS[dimension];
  return value + parseInt(getStyle(elem, margins[0]), 10) + parseInt(getStyle(elem, margins[1]), 10);
}
function getScrollDimensionValue(elem, dimension) {
  const value = get(elem, `scroll${capitalize(dimension)}`);
  return `${value}px`;
}

/**
 * A Collapse animation component.
 * @see https://rsuitejs.com/components/animation/#collapse
 */
const Collapse = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Collapse', props);
  const {
    className,
    timeout = 300,
    dimension: dimensionProp = DIMENSION.HEIGHT,
    exitedClassName,
    exitingClassName,
    enteredClassName,
    enteringClassName,
    getDimensionValue = defaultGetDimensionValue,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    ...rest
  } = propsWithDefaults;
  const {
    prefix,
    merge
  } = useStyles('anim');
  const dimension = typeof dimensionProp === 'function' ? dimensionProp() : dimensionProp;
  const handleEnter = useCallback(elem => {
    addStyle(elem, dimension, 0);
  }, [dimension]);
  const handleEntering = useCallback(elem => {
    addStyle(elem, dimension, getScrollDimensionValue(elem, dimension));
  }, [dimension]);
  const handleEntered = useCallback(elem => {
    addStyle(elem, dimension, 'auto');
  }, [dimension]);
  const handleExit = useCallback(elem => {
    const value = getDimensionValue ? getDimensionValue(dimension, elem) : 0;
    addStyle(elem, dimension, `${value}px`);
  }, [dimension, getDimensionValue]);
  const handleExiting = useCallback(elem => {
    triggerBrowserReflow(elem);
    addStyle(elem, dimension, 0);
  }, [dimension]);
  return /*#__PURE__*/React.createElement(Transition, _extends({}, rest, {
    ref: ref,
    timeout: timeout,
    className: merge(className, prefix({
      'collapse-horizontal': dimension === 'width'
    })),
    exitedClassName: exitedClassName || prefix('collapse'),
    exitingClassName: exitingClassName || prefix('collapsing'),
    enteredClassName: enteredClassName || prefix('collapse', 'in'),
    enteringClassName: enteringClassName || prefix('collapsing'),
    onEnter: createChainedFunction(handleEnter, onEnter),
    onEntering: createChainedFunction(handleEntering, onEntering),
    onEntered: createChainedFunction(handleEntered, onEntered),
    onExit: createChainedFunction(handleExit, onExit),
    onExiting: createChainedFunction(handleExiting, onExiting)
  }));
});
Collapse.displayName = 'Collapse';
export default Collapse;