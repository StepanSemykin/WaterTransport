'use client';
import React, { useRef, useState, useImperativeHandle } from 'react';
import Button from "../Button/index.js";
import { useStyles, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
import classNames from 'classnames';
const UploadTrigger = forwardRef((props, ref) => {
  var _children$props;
  const {
    as: Component = Button,
    name,
    accept,
    multiple,
    disabled,
    readOnly,
    children,
    classPrefix = 'uploader-trigger',
    className,
    draggable,
    locale,
    onChange,
    onDragEnter,
    onDragLeave,
    onDragOver,
    onDrop,
    ...rest
  } = props;
  const rootRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);
  const {
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = classNames(className, withPrefix({
    customize: children,
    'drag-over': dragOver
  }));
  const handleClick = useEventCallback(() => {
    var _inputRef$current;
    (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 || _inputRef$current.click();
  });
  const handleClearInput = useEventCallback(() => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  });
  const handleDragEnter = useEventCallback(event => {
    if (draggable) {
      event.preventDefault();
      setDragOver(true);
    }
    onDragEnter === null || onDragEnter === void 0 || onDragEnter(event);
  });
  const handleDragLeave = useEventCallback(event => {
    if (draggable) {
      event.preventDefault();
      setDragOver(false);
    }
    onDragLeave === null || onDragLeave === void 0 || onDragLeave(event);
  });
  const handleDragOver = useEventCallback(event => {
    draggable && event.preventDefault();
    onDragOver === null || onDragOver === void 0 || onDragOver(event);
  });
  const handleDrop = useEventCallback(event => {
    if (draggable) {
      event.preventDefault();
      setDragOver(false);
      onChange === null || onChange === void 0 || onChange(event);
    }
    onDrop === null || onDrop === void 0 || onDrop(event);
  });
  useImperativeHandle(ref, () => ({
    root: rootRef.current,
    clearInput: handleClearInput
  }));

  // Prepare button props with event handlers conditionally applied
  const buttonProps = {
    ...rest,
    disabled,
    className: prefix('btn'),
    // Only add event handlers if component is interactive
    ...(!disabled && !readOnly && {
      onClick: handleClick,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop
    })
  };
  const trigger = children ? (/*#__PURE__*/React.cloneElement(children, {
    ...buttonProps,
    className: classNames((_children$props = children.props) === null || _children$props === void 0 ? void 0 : _children$props.className, prefix('btn'))
  })) : /*#__PURE__*/React.createElement(Component, buttonProps, locale === null || locale === void 0 ? void 0 : locale.upload);
  return /*#__PURE__*/React.createElement("div", {
    ref: rootRef,
    className: classes,
    "data-disabled": disabled
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    name: name,
    multiple: multiple,
    disabled: disabled,
    readOnly: readOnly,
    accept: accept,
    ref: inputRef,
    onChange: onChange
  }), trigger);
});
UploadTrigger.displayName = 'UploadTrigger';
export default UploadTrigger;