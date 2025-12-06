'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useEffect, useRef } from 'react';
import omit from 'lodash/omit';
import createTextMaskInputElement from "./createTextMaskInputElement.js";
import { mergeRefs } from "../internals/utils/index.js";

/**
 * https://github.com/text-mask/text-mask/blob/master/componentDocumentation.md#guide
 */

const defaultRender = (ref, props) => /*#__PURE__*/React.createElement("input", _extends({
  ref: ref
}, props));

/**
 * The `TextMask` component is used to format the user input data.
 * @see https://rsuitejs.com/components/input/#masked-input
 */
const TextMask = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    mask,
    guide = true,
    placeholderChar,
    value,
    showMask,
    pipe,
    render = defaultRender,
    onChange,
    ...rest
  } = props;
  const inputRef = useRef(null);
  const textMaskInputElement = useRef(null);
  const initTextMask = useCallback(() => {
    var _textMaskInputElement;
    textMaskInputElement.current = createTextMaskInputElement({
      inputElement: inputRef.current,
      ...props
    });
    (_textMaskInputElement = textMaskInputElement.current) === null || _textMaskInputElement === void 0 || _textMaskInputElement.update(value);
  }, [props, value]);
  const handleChange = useCallback(event => {
    var _textMaskInputElement2;
    (_textMaskInputElement2 = textMaskInputElement.current) === null || _textMaskInputElement2 === void 0 || _textMaskInputElement2.update();
    onChange === null || onChange === void 0 || onChange(event);
  }, [onChange]);
  useEffect(() => {
    initTextMask();
  }, [guide, placeholderChar, showMask, pipe, mask, value, initTextMask]);
  return render(mergeRefs(inputRef, ref), {
    onChange: handleChange,
    defaultValue: value,
    ...omit(rest, ['keepCharPositions'])
  });
});
TextMask.displayName = 'TextMask';
export default TextMask;