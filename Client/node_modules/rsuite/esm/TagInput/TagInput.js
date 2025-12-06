'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import InputPicker from "../InputPicker/InputPicker.js";
import { forwardRef } from "../internals/utils/index.js";
import { TagProvider } from "../InputPicker/InputPickerContext.js";
import { useCustom } from "../internals/hooks/index.js";
/**
 * The `TagInput` component is an enhancement of Input and supports input tags and management tags.
 *
 * @see https://rsuitejs.com/components/tag-input
 */
const TagInput = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('TagInput', props);
  const {
    tagProps = {},
    trigger = 'Enter',
    value,
    defaultValue,
    onTagRemove,
    ...rest
  } = propsWithDefaults;
  const contextValue = useMemo(() => ({
    multi: true,
    disabledOptions: true,
    trigger,
    tagProps,
    onTagRemove
  }), [onTagRemove, tagProps, trigger]);
  const data = useMemo(() => (value || defaultValue || []).map(v => ({
    value: v,
    label: v
  })), [defaultValue, value]);
  return /*#__PURE__*/React.createElement(TagProvider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(InputPicker, _extends({}, rest, {
    "aria-haspopup": false,
    "aria-expanded": undefined,
    "aria-controls": undefined,
    "aria-keyshortcuts": trigger,
    value: value,
    defaultValue: defaultValue,
    data: data,
    placement: undefined,
    creatable: true,
    ref: ref
  })));
});
TagInput.displayName = 'TagInput';
export default TagInput;