'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import _omit from "lodash/omit";
import React, { useRef, useMemo } from 'react';
import ToggleButton from "./ToggleButton.js";
import PickerIndicator from "./PickerIndicator.js";
import PickerLabel from "./PickerLabel.js";
import Plaintext from "../Plaintext/index.js";
import Stack from "../../Stack/index.js";
import useCombobox from "./hooks/useCombobox.js";
import { useStyles, useEventCallback, useToggleCaret } from "../hooks/index.js";
import { forwardRef, mergeRefs } from "../utils/index.js";
import { triggerPropKeys } from "./PickerToggleTrigger.js";
const PickerToggle = forwardRef((props, ref) => {
  const {
    active,
    as: Component = ToggleButton,
    classPrefix = 'picker-toggle',
    children,
    caret = true,
    className,
    disabled,
    readOnly,
    plaintext,
    hasValue,
    loading = false,
    cleanable,
    countable,
    tabIndex = 0,
    inputValue: inputValueProp,
    focusItemValue,
    placement = 'bottomStart',
    caretComponent,
    caretAs = caretComponent,
    label,
    name,
    size,
    onClean,
    ...rest
  } = props;
  const combobox = useRef(null);
  const {
    withPrefix,
    merge,
    prefix
  } = useStyles(classPrefix);
  const {
    id,
    labelId,
    popupType
  } = useCombobox();
  const inputValue = useMemo(() => {
    if (typeof inputValueProp === 'number' || typeof inputValueProp === 'string') {
      return inputValueProp;
    } else if (Array.isArray(inputValueProp)) {
      return inputValueProp.join(',');
    }
    return '';
  }, [inputValueProp]);
  const classes = merge(className, withPrefix());
  const handleClean = useEventCallback(event => {
    var _combobox$current;
    event.stopPropagation();
    onClean === null || onClean === void 0 || onClean(event);
    (_combobox$current = combobox.current) === null || _combobox$current === void 0 || _combobox$current.focus();
  });
  const ToggleCaret = useToggleCaret(placement);
  const Caret = caretAs !== null && caretAs !== void 0 ? caretAs : ToggleCaret;
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, {
      ref: ref,
      localeKey: "notSelected"
    }, hasValue ? children : null);
  }
  const showCleanButton = cleanable && hasValue && !readOnly;
  return /*#__PURE__*/React.createElement(Component, _extends({
    role: "combobox",
    id: id,
    size: size,
    "aria-haspopup": popupType,
    "aria-expanded": active,
    "aria-disabled": disabled,
    "aria-controls": id ? `${id}-${popupType}` : undefined,
    "aria-labelledby": labelId,
    "aria-describedby": id ? `${id}-describe` : undefined,
    "aria-activedescendant": active && focusItemValue ? `${id}-opt-${focusItemValue}` : undefined,
    "data-has-value": hasValue,
    "data-cleanable": cleanable,
    "data-countable": countable,
    "data-size": size,
    "data-readonly": readOnly,
    "data-active": active,
    ref: mergeRefs(combobox, ref),
    disabled: disabled,
    tabIndex: disabled ? undefined : tabIndex,
    className: classes
  }, _omit(rest, triggerPropKeys)), /*#__PURE__*/React.createElement(Stack, {
    className: prefix('stack')
  }, label && /*#__PURE__*/React.createElement(Stack.Item, null, /*#__PURE__*/React.createElement(PickerLabel, {
    as: "span",
    className: prefix('label'),
    id: labelId
  }, label)), /*#__PURE__*/React.createElement(Stack.Item, {
    grow: 1,
    overflow: "hidden"
  }, /*#__PURE__*/React.createElement("input", {
    readOnly: true,
    "aria-hidden": true,
    tabIndex: -1,
    "data-testid": "picker-toggle-input",
    name: name,
    value: inputValue,
    className: prefix('textbox'),
    style: {
      pointerEvents: 'none'
    }
  }), children ? /*#__PURE__*/React.createElement("span", {
    className: prefix(hasValue ? 'value' : 'placeholder'),
    id: `${id}-describe`,
    "data-testid": "picker-describe"
  }, children) : null), /*#__PURE__*/React.createElement(Stack.Item, {
    className: prefix`indicator`
  }, /*#__PURE__*/React.createElement(PickerIndicator, {
    size: size,
    as: React.Fragment,
    loading: loading,
    caretAs: caret ? Caret : null,
    onClose: handleClean,
    showCleanButton: showCleanButton
  }))));
});
PickerToggle.displayName = 'PickerToggle';
export default PickerToggle;