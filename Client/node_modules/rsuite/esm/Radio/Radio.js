'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import Box from "../internals/Box/index.js";
import { RadioContext } from "../RadioGroup/RadioGroup.js";
import { useStyles, useCustom, useControlled, useEventCallback, useUniqueId } from "../internals/hooks/index.js";
import { forwardRef, partitionHTMLProps } from "../internals/utils/index.js";
/**
 * The `Radio` component is a simple radio button.
 * @see https://rsuitejs.com/components/radio
 */
const Radio = forwardRef((props, ref) => {
  const radioContext = useContext(RadioContext);
  const {
    propsWithDefaults
  } = useCustom('Radio', props);
  const {
    value: groupValue,
    inline: inlineContext,
    name: nameContext,
    disabled: disabledContext,
    readOnly: readOnlyContext,
    plaintext: plaintextContext,
    onChange: onGroupChange
  } = radioContext !== null && radioContext !== void 0 ? radioContext : {};
  const {
    as,
    title,
    className,
    children,
    checked: checkedProp,
    color,
    defaultChecked,
    classPrefix = 'radio',
    tabIndex = 0,
    inputRef,
    inputProps,
    disabled = disabledContext,
    readOnly = readOnlyContext,
    plaintext = plaintextContext,
    inline = inlineContext,
    name = nameContext,
    value,
    onChange,
    onClick,
    ...rest
  } = propsWithDefaults;
  const [checked, setChecked, selfControlled] = useControlled(typeof groupValue !== 'undefined' ? groupValue === value : checkedProp, defaultChecked || false);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const [htmlInputProps, restProps] = partitionHTMLProps(rest);
  const handleChange = useEventCallback(event => {
    if (disabled || readOnly) {
      return;
    }
    setChecked(true);
    onGroupChange === null || onGroupChange === void 0 || onGroupChange(value, event);
    onChange === null || onChange === void 0 || onChange(value, true, event);
  });
  const controlled = radioContext ? true : selfControlled;
  if (typeof controlled !== 'undefined') {
    // In uncontrolled situations, use defaultChecked instead of checked
    htmlInputProps[controlled ? 'checked' : 'defaultChecked'] = checked;
  }
  const labelId = useUniqueId('label-');
  if (plaintext) {
    return checked ? /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: ref,
      className: classes
    }, restProps), children) : null;
  }
  const control = /*#__PURE__*/React.createElement("span", {
    className: prefix`control`
  }, /*#__PURE__*/React.createElement("input", _extends({}, htmlInputProps, inputProps, {
    "aria-labelledby": labelId,
    "aria-checked": checked,
    "aria-disabled": disabled,
    ref: inputRef,
    type: "radio",
    name: name,
    value: value,
    tabIndex: tabIndex,
    readOnly: readOnly,
    disabled: disabled,
    onChange: handleChange
  })), /*#__PURE__*/React.createElement("span", {
    className: prefix`inner`,
    "aria-hidden": true
  }));
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    onClick: onClick,
    className: classes,
    "data-color": color,
    "data-checked": checked,
    "data-disabled": disabled,
    "data-inline": inline
  }, restProps), /*#__PURE__*/React.createElement("div", {
    className: prefix`checker`
  }, children ? /*#__PURE__*/React.createElement("label", {
    title: title
  }, control, /*#__PURE__*/React.createElement("span", {
    className: prefix`label`,
    id: labelId
  }, children)) : control));
});
Radio.displayName = 'Radio';
export default Radio;