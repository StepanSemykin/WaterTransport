'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import InputBase from "../internals/InputBase/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { InputGroupContext } from "../InputGroup/index.js";
import { useCustom } from "../internals/hooks/index.js";
/**
 * The `<Input>` component is used to get user input in a text field.
 *
 * @see https://rsuitejs.com/components/input
 */
const Input = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Input', props);
  const inputGroup = useContext(InputGroupContext);
  const {
    type = 'text',
    htmlSize,
    size = (inputGroup === null || inputGroup === void 0 ? void 0 : inputGroup.size) || 'md',
    classPrefix = 'input',
    ...rest
  } = propsWithDefaults;
  return /*#__PURE__*/React.createElement(InputBase, _extends({
    as: "input",
    ref: ref,
    classPrefix: classPrefix,
    size: size,
    type: type,
    inputProps: {
      size: htmlSize
    }
  }, rest));
});
Input.displayName = 'Input';
export default Input;