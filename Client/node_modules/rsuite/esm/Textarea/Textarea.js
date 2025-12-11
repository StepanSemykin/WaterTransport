'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';
import InputBase from "../internals/InputBase/index.js";
import { forwardRef, mergeStyles } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
const Textarea = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Textarea', props);
  const {
    rows = 3,
    classPrefix = 'textarea',
    className,
    size = 'md',
    autosize,
    maxRows,
    minRows,
    resize,
    style,
    ...rest
  } = propsWithDefaults;
  const {
    withPrefix,
    merge,
    cssVar
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const styles = mergeStyles(style, cssVar('resize', resize));
  const autosizeProps = autosize ? {
    maxRows,
    minRows
  } : {};
  return /*#__PURE__*/React.createElement(InputBase, _extends({
    as: autosize ? ReactTextareaAutosize : 'textarea',
    ref: ref,
    size: size,
    rows: rows,
    className: classes,
    style: styles
  }, autosizeProps, rest));
});
Textarea.displayName = 'Textarea';
export default Textarea;