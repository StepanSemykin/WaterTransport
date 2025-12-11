'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useStyles, useCustom, useUniqueId } from "../internals/hooks/index.js";
import { FormGroupContext } from "./FormGroupContext.js";
/**
 * The `<Form.Group>` component is the easiest way to add some structure to forms.
 * @see https://rsuitejs.com/components/form/
 */
const FormGroup = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('FormGroup', props);
  const {
    as,
    classPrefix = 'form-group',
    controlId: controlIdProp,
    className,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const controlId = useUniqueId('rs-', controlIdProp);
  const contextValue = useMemo(() => ({
    controlId
  }), [controlId]);
  return /*#__PURE__*/React.createElement(FormGroupContext.Provider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(Box, _extends({
    as: as
  }, rest, {
    ref: ref,
    className: classes,
    role: "group"
  })));
});
FormGroup.displayName = 'FormGroup';
export default FormGroup;