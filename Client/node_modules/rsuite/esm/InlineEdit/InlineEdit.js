'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import EditableControls from "./EditableControls.js";
import useFocusEvent from "./useFocusEvent.js";
import useEditState from "./useEditState.js";
import Box from "../internals/Box/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs } from "../internals/utils/index.js";
import { renderChildren, defaultRenderInput } from "./renderChildren.js";
const InlineEdit = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('InlineEdit', props);
  const {
    as,
    children = defaultRenderInput,
    classPrefix = 'inline-edit',
    className,
    disabled,
    size = 'md',
    showControls = true,
    stateOnBlur = 'save',
    placeholder,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const {
    value,
    isEditing,
    onSave,
    onCancel,
    onChange,
    onKeyDown,
    onClick,
    onFocus,
    htmlProps
  } = useEditState({
    ...rest,
    disabled
  });
  const {
    target,
    root,
    onBlur
  } = useFocusEvent({
    isEditing,
    stateOnBlur,
    onSave,
    onCancel
  });
  const childrenProps = {
    size,
    value,
    disabled,
    placeholder,
    plaintext: !isEditing,
    onChange,
    onBlur
  };
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: mergeRefs(root, ref),
    tabIndex: 0,
    className: merge(className, withPrefix()),
    onClick: onClick,
    onKeyDown: onKeyDown,
    onFocus: onFocus,
    "data-disabled": disabled,
    "data-size": size
  }, htmlProps), renderChildren(children, childrenProps, target), showControls && isEditing && /*#__PURE__*/React.createElement(EditableControls, {
    className: prefix('controls'),
    onSave: onSave,
    onCancel: onCancel
  }));
});
InlineEdit.displayName = 'InlineEdit';
export default InlineEdit;