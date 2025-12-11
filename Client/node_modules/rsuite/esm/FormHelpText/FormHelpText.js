'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import HelpOutlineIcon from '@rsuite/icons/HelpOutline';
import Tooltip from "../Tooltip/index.js";
import Whisper from "../Whisper/index.js";
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { useFormGroup } from "../FormGroup/index.js";
/**
 * The `<Form.HelpText>` component is used to display help information in the form.
 * @see https://rsuitejs.com/components/form/
 */
const FormHelpText = forwardRef((props, ref) => {
  const {
    helpTextId
  } = useFormGroup();
  const {
    propsWithDefaults
  } = useCustom('FormHelpText', props);
  const {
    as = 'span',
    classPrefix = 'form-help-text',
    className,
    tooltip,
    children,
    id = helpTextId,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    tooltip
  }));
  if (tooltip) {
    return /*#__PURE__*/React.createElement(Whisper, {
      ref: ref,
      placement: "topEnd",
      speaker: /*#__PURE__*/React.createElement(Tooltip, _extends({
        id: id
      }, rest), children)
    }, /*#__PURE__*/React.createElement(Box, {
      as: as,
      role: "img",
      "aria-label": "help",
      className: classes
    }, /*#__PURE__*/React.createElement(HelpOutlineIcon, {
      "aria-hidden": true
    })));
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    id: id
  }, rest, {
    ref: ref,
    className: classes
  }), children);
});
FormHelpText.displayName = 'FormHelpText';
export default FormHelpText;