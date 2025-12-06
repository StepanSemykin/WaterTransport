'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, kebabPlace } from "../internals/utils/index.js";
/**
 * The `<Form.ErrorMessage>` component is used to display error messages in the form.
 * @see https://rsuitejs.com/components/form/
 */
const FormErrorMessage = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('FormErrorMessage', props);
  const {
    as,
    classPrefix = 'form-error-message',
    className,
    show,
    children,
    placement,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    prefix,
    merge
  } = useStyles(classPrefix);
  const classes = withPrefix('show');
  const wrapperClasses = merge(className, prefix('wrapper'));
  return show ? /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    "data-placement": kebabPlace(placement),
    className: wrapperClasses
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: classes
  }, /*#__PURE__*/React.createElement("span", {
    className: prefix`arrow`
  }), /*#__PURE__*/React.createElement("span", {
    className: prefix`inner`
  }, children))) : null;
});
FormErrorMessage.displayName = 'FormErrorMessage';
export default FormErrorMessage;