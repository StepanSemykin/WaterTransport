'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { forwardRef } from "../utils/react/forwardRef.js";
import { extractBoxProps, omitBoxProps } from "./utils.js";
import { useStyled, getCSSVariables } from "../styled-system/index.js";
/**
 * Box component is the base component for all components,
 * providing shorthand for style properties.
 *
 * @see https://rsuitejs.com/components/box
 */
const Box = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    className,
    children,
    showFrom,
    hideFrom,
    style,
    ...rest
  } = props;
  const boxProps = extractBoxProps(rest);
  const domProps = omitBoxProps(rest);
  const boxCSSVars = getCSSVariables(boxProps, '--rs-box-');
  const isBox = !isEmpty(boxCSSVars) || showFrom || hideFrom;
  const styled = useStyled({
    cssVars: boxCSSVars,
    className,
    style,
    enabled: isBox
  });
  return /*#__PURE__*/React.createElement(Component, _extends({
    ref: ref,
    "data-rs": isBox ? 'box' : undefined,
    "data-visible-from": showFrom,
    "data-hidden-from": hideFrom,
    className: styled.className,
    style: styled.style
  }, domProps), children);
});
Box.displayName = 'Box';
export default Box;