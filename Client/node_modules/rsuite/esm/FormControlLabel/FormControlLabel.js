'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useFormGroup } from "../FormGroup/index.js";
/**
 * The `<Form.ControlLabel>` component renders a label with required indicator, for form controls.
 * @see https://rsuitejs.com/components/form/
 */
const FormControlLabel = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('FormControlLabel', props);
  const {
    labelId,
    controlId
  } = useFormGroup();
  const {
    as = 'label',
    classPrefix = 'form-control-label',
    htmlFor = controlId,
    className,
    id = labelId,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    id: id,
    htmlFor: htmlFor
  }, rest, {
    ref: ref,
    className: classes
  }));
});
FormControlLabel.displayName = 'FormControlLabel';
export default FormControlLabel;