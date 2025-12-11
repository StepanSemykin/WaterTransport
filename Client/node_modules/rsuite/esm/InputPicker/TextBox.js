'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import TagList from "./TagList.js";
import InputSearch from "./InputSearch.js";
import { useStyles } from "../internals/hooks/index.js";
const TextBox = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    tags,
    inputProps,
    readOnly,
    disabled,
    multiple,
    onBlur,
    onFocus,
    onChange,
    inputValue,
    inputRef,
    editable,
    showTagList,
    ...rest
  } = props;
  const {
    prefix
  } = useStyles('picker');
  if (!multiple && disabled) {
    return null;
  }
  const input = editable ? /*#__PURE__*/React.createElement(InputSearch, _extends({}, inputProps, {
    tabIndex: -1,
    readOnly: readOnly,
    onBlur: onBlur,
    onFocus: onFocus,
    inputRef: inputRef,
    onChange: onChange,
    value: inputValue
  })) : null;
  return /*#__PURE__*/React.createElement("div", _extends({
    className: prefix`textbox`,
    ref: ref
  }, rest), showTagList ? /*#__PURE__*/React.createElement(TagList, null, tags, input) : input);
});
TextBox.displayName = 'TextBox';
export default TextBox;