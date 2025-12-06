'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import useCombobox from "../internals/Picker/hooks/useCombobox.js";
import { useStyles } from "../internals/hooks/index.js";
const TagList = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    children,
    ...rest
  } = props;
  const {
    prefix
  } = useStyles('picker');
  const {
    id
  } = useCombobox();
  return /*#__PURE__*/React.createElement("div", _extends({
    ref: ref,
    role: "listbox",
    id: `${id}-describe`,
    className: prefix`tag-list`
  }, rest), children);
});
TagList.displayName = 'TagList';
export default TagList;