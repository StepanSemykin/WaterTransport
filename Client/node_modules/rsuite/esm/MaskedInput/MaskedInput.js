'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import TextMask from "./TextMask.js";
import Input from "../Input/index.js";
import { forwardRef } from "../internals/utils/index.js";
import { useCustom } from "../internals/hooks/index.js";
const MaskedInput = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('MaskedInput', props);
  const {
    as: inputAs = TextMask
  } = propsWithDefaults;
  return /*#__PURE__*/React.createElement(Input, _extends({}, propsWithDefaults, {
    as: inputAs,
    ref: ref
  }));
});
MaskedInput.displayName = 'MaskedInput';
export default MaskedInput;