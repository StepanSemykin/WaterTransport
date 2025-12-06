'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState, useRef, useImperativeHandle, useEffect, useMemo } from 'react';
import Box from "../internals/Box/index.js";
import { partitionHTMLProps, isIE, guid } from "../internals/utils/index.js";
const sizerStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  visibility: 'hidden',
  height: 0,
  overflow: 'scroll',
  whiteSpace: 'pre'
};
const copyStyles = (styles, node) => {
  node.style.fontSize = styles.fontSize;
  node.style.fontFamily = styles.fontFamily;
  node.style.fontWeight = styles.fontWeight;
  node.style.fontStyle = styles.fontStyle;
  node.style.letterSpacing = styles.letterSpacing;
  node.style.textTransform = styles.textTransform;
};
/**
 * Use a dynamic input width.
 * The width is automatically adjusted according to the length of the input text characters.
 * @param props
 * @param sizerRef
 * @param placeholderRef
 */
const useInputWidth = (props, sizerRef, placeholderRef) => {
  const {
    minWidth = 1,
    placeholder,
    value,
    onAutosize
  } = props;
  const [inputWidth, setInputWidth] = useState(minWidth);
  useEffect(() => {
    if (!sizerRef.current || typeof sizerRef.current.scrollWidth === 'undefined') {
      return;
    }
    let width;
    if (placeholder && !value && placeholderRef.current) {
      width = Math.max(sizerRef.current.scrollWidth, placeholderRef.current.scrollWidth) + 10;
    } else {
      width = sizerRef.current.scrollWidth + 10;
    }
    if (width < minWidth) {
      width = minWidth;
    }
    if (width !== inputWidth) {
      setInputWidth(width);
      onAutosize === null || onAutosize === void 0 || onAutosize(width);
    }
  }, [minWidth, placeholder, inputWidth, value, placeholderRef, sizerRef, onAutosize]);
  return inputWidth;
};
const InputAutosize = /*#__PURE__*/React.forwardRef((props, ref) => {
  const uniqueId = useMemo(() => guid(), []);
  const {
    defaultValue,
    value,
    style,
    className,
    placeholder,
    inputClassName,
    inputStyle,
    inputId = uniqueId,
    tabIndex
  } = props;
  const rootRef = useRef(null);
  const inputRef = useRef(null);
  const sizerRef = useRef(null);
  const placeholderRef = useRef(null);
  useImperativeHandle(ref, () => ({
    root: rootRef.current,
    input: inputRef.current
  }));
  const sizerValue = [defaultValue, value, ''].reduce((previousValue, currentValue) => {
    if (previousValue !== null && previousValue !== undefined) {
      return previousValue;
    }
    return currentValue;
  });
  const inputWidth = useInputWidth(props, sizerRef, placeholderRef);
  const nextInputStyle = {
    boxSizing: 'content-box',
    width: `${inputWidth}px`,
    ...inputStyle
  };
  useEffect(() => {
    if (!window.getComputedStyle) {
      return;
    }
    const input = inputRef.current;
    const inputStyles = input && window.getComputedStyle(input);
    if (!inputStyles) {
      return;
    }
    if (sizerRef.current) {
      copyStyles(inputStyles, sizerRef.current);
    }
    if (placeholderRef.current) {
      copyStyles(inputStyles, placeholderRef.current);
    }
  }, []);
  const [htmlInputProps] = partitionHTMLProps(props);
  htmlInputProps.className = inputClassName;
  htmlInputProps.style = nextInputStyle;
  htmlInputProps.tabIndex = tabIndex;
  if (isIE()) {
    // On Internet Explorer, an `x` symbol will appear in the input box.
    // By setting an id, matching the style, hiding the `x` symbol by the style.
    htmlInputProps.id = inputId;
  }
  return /*#__PURE__*/React.createElement(Box, {
    ref: rootRef,
    className: className,
    style: style,
    display: "inline-block"
  }, isIE() ? /*#__PURE__*/React.createElement("style", {
    dangerouslySetInnerHTML: {
      __html: `input#${inputId}::-ms-clear {display: none;}`
    }
  }) : null, /*#__PURE__*/React.createElement("input", _extends({}, htmlInputProps, {
    ref: inputRef,
    type: "text"
  })), /*#__PURE__*/React.createElement("div", {
    ref: sizerRef,
    style: sizerStyle
  }, sizerValue), placeholder ? /*#__PURE__*/React.createElement("div", {
    ref: placeholderRef,
    style: sizerStyle
  }, placeholder) : null);
});
InputAutosize.displayName = 'InputAutosize';
export default InputAutosize;