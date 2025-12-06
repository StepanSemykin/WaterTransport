'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef } from 'react';
import SelectPicker from "../SelectPicker/index.js";
import { forwardRef, mergeRefs, tplTransform } from "../internals/utils/index.js";
const LimitPicker = forwardRef((props, ref) => {
  const {
    as: Component = 'div',
    disabled,
    limitOptions,
    locale,
    limit,
    onChangeLimit,
    size,
    prefix,
    ...rest
  } = props;
  const containerRef = useRef(null);
  const disabledPicker = typeof disabled === 'function' ? disabled('picker') : Boolean(disabled);
  const formatlimitOptions = limitOptions.map(item => {
    return {
      value: item,
      label: locale.limit && tplTransform(locale.limit, item)
    };
  });
  return /*#__PURE__*/React.createElement(Component, {
    className: prefix('limit'),
    ref: mergeRefs(containerRef, ref)
  }, /*#__PURE__*/React.createElement(SelectPicker, _extends({}, rest, {
    size: size,
    cleanable: false,
    searchable: false,
    placement: "topStart",
    data: formatlimitOptions,
    value: limit,
    onChange: onChangeLimit,
    popupStyle: {
      minWidth: 'auto'
    },
    disabled: disabledPicker,
    container: () => containerRef.current
  })));
});
export default LimitPicker;