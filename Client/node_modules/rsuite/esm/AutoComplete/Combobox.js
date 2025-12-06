'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Input from "../Input/index.js";
import { useCombobox } from "../internals/Picker/index.js";
import { forwardRef } from "../internals/utils/index.js";
const Combobox = forwardRef((props, ref) => {
  const {
    id,
    popupType
  } = useCombobox();
  const {
    expanded,
    focusItemValue,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Input, _extends({
    role: "combobox",
    "aria-autocomplete": "list",
    "aria-haspopup": popupType,
    "aria-expanded": expanded,
    "aria-activedescendant": focusItemValue ? `${id}-opt-${focusItemValue}` : undefined,
    autoComplete: "off",
    id: id,
    ref: ref
  }, rest));
});
Combobox.displayName = 'Combobox';
export default Combobox;