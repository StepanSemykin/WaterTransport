'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef } from 'react';
import Plaintext from "../internals/Plaintext/index.js";
import Loader from "../Loader/index.js";
import Box from "../internals/Box/index.js";
import { useStyles, useControlled, useUniqueId, useEventCallback, useCustom } from "../internals/hooks/index.js";
import { forwardRef, partitionHTMLProps } from "../internals/utils/index.js";
/**
 * The `Toggle` component is used to activate or deactivate an element.
 *
 * @see https://rsuitejs.com/components/toggle
 */
const Toggle = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Toggle', props);
  const {
    as = 'label',
    disabled,
    readOnly,
    loading = false,
    plaintext,
    children,
    className,
    color,
    checkedChildren,
    unCheckedChildren,
    classPrefix = 'toggle',
    checked: checkedProp,
    defaultChecked,
    size = 'md',
    locale,
    label = children,
    labelPlacement = 'end',
    onChange,
    ...rest
  } = propsWithDefaults;
  const inputRef = useRef(null);
  const [checked, setChecked] = useControlled(checkedProp, defaultChecked);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({}));
  const inner = checked ? checkedChildren : unCheckedChildren;
  const innerLabel = checked ? locale === null || locale === void 0 ? void 0 : locale.on : locale === null || locale === void 0 ? void 0 : locale.off;
  const labelId = useUniqueId('rs-label');
  const innerId = inner ? labelId + '-inner' : undefined;
  const labelledby = label ? labelId : innerId;
  const [htmlInputProps, restProps] = partitionHTMLProps(rest);
  const handleInputChange = useEventCallback(e => {
    if (disabled || readOnly || loading) {
      return;
    }
    const {
      checked
    } = e.target;
    setChecked(checked);
    onChange === null || onChange === void 0 || onChange(checked, e);
  });
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, null, inner || innerLabel);
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "data-placement": labelPlacement,
    "data-color": color,
    "data-size": size,
    "data-checked": checked,
    "data-loading": loading,
    "data-disabled": disabled
  }, restProps), /*#__PURE__*/React.createElement("input", _extends({}, htmlInputProps, {
    ref: inputRef,
    type: "checkbox",
    checked: checkedProp,
    defaultChecked: defaultChecked,
    disabled: disabled,
    readOnly: readOnly,
    onChange: handleInputChange,
    className: prefix('input'),
    role: "switch",
    "aria-checked": checked,
    "aria-disabled": disabled,
    "aria-labelledby": labelledby,
    "aria-label": labelledby ? undefined : innerLabel,
    "aria-busy": loading || undefined
  })), /*#__PURE__*/React.createElement("span", {
    className: prefix('track')
  }, inner && /*#__PURE__*/React.createElement("span", {
    className: prefix('inner'),
    id: innerId
  }, inner), loading && /*#__PURE__*/React.createElement(Loader, {
    className: prefix('loader')
  })), label && /*#__PURE__*/React.createElement("span", {
    className: prefix('label'),
    id: labelId
  }, label));
});
Toggle.displayName = 'Toggle';
export default Toggle;