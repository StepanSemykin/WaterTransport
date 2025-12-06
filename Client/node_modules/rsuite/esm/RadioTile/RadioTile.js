'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext } from 'react';
import CheckIcon from '@rsuite/icons/Check';
import Box from "../internals/Box/index.js";
import { RadioTileContext } from "../RadioTileGroup/RadioTileGroup.js";
import { forwardRef, partitionHTMLProps } from "../internals/utils/index.js";
import { useStyles, useCustom, useControlled, useUniqueId } from "../internals/hooks/index.js";
/**
 * A series of selectable tile components that behave like Radio.
 * @version 5.35.0
 * @see https://rsuitejs.com/components/radio-tile/
 */
const RadioTile = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('RadioTile', props);
  const {
    value: groupValue,
    name: nameContext,
    disabled: disabledContext,
    onChange: onGroupChange
  } = useContext(RadioTileContext);
  const {
    as = 'label',
    children,
    classPrefix = 'radio-tile',
    checked: checkedProp,
    className,
    defaultChecked,
    disabled = disabledContext,
    icon,
    value,
    label,
    name = nameContext,
    tabIndex = 0,
    onChange,
    ...rest
  } = propsWithDefaults;
  const [checked, setChecked] = useControlled(typeof groupValue !== 'undefined' ? groupValue === value : checkedProp, defaultChecked || false);
  const [htmlInputProps, restProps] = partitionHTMLProps(rest);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const handleChange = useCallback(event => {
    setChecked(true);
    onGroupChange === null || onGroupChange === void 0 || onGroupChange(value, event);
    onChange === null || onChange === void 0 || onChange(value, event);
  }, [onChange, onGroupChange, setChecked, value]);
  const classes = merge(className, withPrefix());
  const radioId = useUniqueId('radio-');
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    ref: ref,
    className: classes,
    "data-disabled": disabled,
    "data-checked": checked
  }, restProps), /*#__PURE__*/React.createElement("div", {
    className: prefix('icon')
  }, icon), /*#__PURE__*/React.createElement("div", {
    className: prefix('body')
  }, /*#__PURE__*/React.createElement("input", _extends({}, htmlInputProps, {
    type: "radio",
    name: name,
    value: value,
    checked: checked,
    tabIndex: tabIndex,
    disabled: disabled,
    onChange: handleChange,
    "aria-checked": checked,
    "aria-disabled": disabled,
    "aria-labelledby": `${radioId}-label`,
    "aria-describedby": `${radioId}-desc`
  })), /*#__PURE__*/React.createElement("div", {
    className: prefix('label'),
    id: `${radioId}-label`
  }, label), /*#__PURE__*/React.createElement("div", {
    className: prefix('content'),
    id: `${radioId}-desc`
  }, children), /*#__PURE__*/React.createElement("div", {
    className: prefix('mark')
  }, /*#__PURE__*/React.createElement(CheckIcon, {
    className: prefix('mark-icon')
  }))));
});
RadioTile.displayName = 'RadioTile';
export default RadioTile;