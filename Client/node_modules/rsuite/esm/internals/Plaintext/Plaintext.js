'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../Box/index.js";
import { forwardRef } from "../utils/index.js";
import { useStyles, useCustom } from "../hooks/index.js";
/**
 * Make the component display in plain text, and display default characters when there is no children.
 * @private
 */
const Plaintext = forwardRef((props, ref) => {
  const {
    getLocale
  } = useCustom();
  const {
    as,
    classPrefix = 'plaintext',
    className,
    children,
    localeKey = '',
    placeholder = getLocale('Plaintext')[localeKey] || '',
    ...rest
  } = props;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    empty: !children
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    role: "text"
  }, rest, {
    ref: ref,
    className: classes
  }), children ? children : placeholder);
});
Plaintext.displayName = 'Plaintext';
export default Plaintext;