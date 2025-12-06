'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import SearchIcon from '@rsuite/icons/Search';
import Input from "../../Input/index.js";
import InputGroup from "../../InputGroup/index.js";
import { useStyles } from "../hooks/index.js";
import { forwardRef } from "../utils/index.js";
const SearchBox = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    classPrefix = 'search-box',
    value,
    className,
    placeholder,
    inputRef,
    onChange,
    ...rest
  } = props;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  return /*#__PURE__*/React.createElement(Component, _extends({}, rest, {
    ref: ref,
    className: classes
  }), /*#__PURE__*/React.createElement(InputGroup, {
    inside: true
  }, /*#__PURE__*/React.createElement(Input, {
    role: "searchbox",
    className: prefix`input`,
    value: value,
    onChange: onChange,
    placeholder: placeholder,
    ref: inputRef
  }), /*#__PURE__*/React.createElement(InputGroup.Addon, null, /*#__PURE__*/React.createElement(SearchIcon, {
    className: prefix`icon`
  }))));
});
SearchBox.displayName = 'SearchBox';
export default SearchBox;