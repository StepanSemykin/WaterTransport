'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useMemo } from 'react';
import InputPicker from "../InputPicker/InputPicker.js";
import { TagProvider } from "../InputPicker/InputPickerContext.js";
import { useCustom } from "../internals/hooks/index.js";
import { forwardRef } from "../internals/utils/index.js";
/**
 * `TagPicker` component enables multi-selection by tags and supports new options.
 *
 * @see https://rsuitejs.com/components/tag-picker/
 */
const TagPicker = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('TagPicker', props);
  const {
    tagProps = {},
    trigger = 'Enter',
    size = 'md',
    onTagRemove,
    renderCheckbox,
    renderValue,
    ...rest
  } = propsWithDefaults;
  const contextValue = useMemo(() => ({
    multi: true,
    trigger,
    tagProps,
    onTagRemove,
    renderCheckbox
  }), [onTagRemove, renderCheckbox, tagProps, trigger]);
  return /*#__PURE__*/React.createElement(TagProvider, {
    value: contextValue
  }, /*#__PURE__*/React.createElement(InputPicker, _extends({
    size: size,
    renderValue: renderValue
  }, rest, {
    ref: ref
  })));
});
TagPicker.displayName = 'TagPicker';
export default TagPicker;