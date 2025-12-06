'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import useCombobox from "./hooks/useCombobox.js";
import Checkbox from "../../Checkbox/index.js";
import { useStyles, useEventCallback } from "../hooks/index.js";
import { forwardRef } from "../utils/index.js";
const ListCheckItem = forwardRef((props, ref) => {
  const {
    active = false,
    as: Component = 'div',
    checkboxAs: CheckboxItem = Checkbox,
    classPrefix = 'check-item',
    checkable = true,
    disabled,
    value,
    focus,
    children,
    className,
    indeterminate,
    labelClickable,
    onKeyDown,
    onSelect,
    onCheck,
    onSelectItem,
    renderCheckbox,
    ...rest
  } = props;
  const handleChange = useEventCallback((value, checked, event) => {
    onSelect === null || onSelect === void 0 || onSelect(value, event, checked);
  });
  const handleCheck = useEventCallback(event => {
    if (!disabled) {
      onCheck === null || onCheck === void 0 || onCheck(value, event, !active);
    }
  });
  const handleSelectItem = useEventCallback(event => {
    if (!disabled) {
      onSelectItem === null || onSelectItem === void 0 || onSelectItem(value, event, !active);
    }
  });
  const {
    id
  } = useCombobox();
  const {
    withPrefix,
    merge,
    rootPrefix
  } = useStyles(classPrefix);
  const checkboxItemClasses = withPrefix({
    focus
  });
  const checkboxProps = {
    checkable,
    children,
    checked: active,
    className: checkboxItemClasses,
    disabled,
    value,
    indeterminate,
    labelClickable,
    onKeyDown: disabled ? undefined : onKeyDown,
    onChange: handleChange,
    onClick: handleSelectItem,
    onCheckboxClick: handleCheck
  };
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "option",
    "aria-selected": active,
    "aria-disabled": disabled,
    id: id ? `${id}-opt-${value}` : undefined,
    "data-key": value
  }, rest, {
    ref: ref,
    className: merge(className, rootPrefix`picker-list-item`),
    tabIndex: -1
  }), renderCheckbox ? renderCheckbox(checkboxProps) : /*#__PURE__*/React.createElement(CheckboxItem, _extends({
    role: "checkbox"
  }, checkboxProps)));
});
ListCheckItem.displayName = 'ListCheckItem';
export default ListCheckItem;