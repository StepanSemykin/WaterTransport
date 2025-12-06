'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Button from "../Button/index.js";
import PredefinedRanges from "./PredefinedRanges.js";
import Stack from "../Stack/index.js";
import { useStyles } from "../internals/hooks/index.js";
const OkButton = ({
  disableOkBtn,
  calendarDate,
  onOk,
  children
}) => {
  const disabled = disableOkBtn === null || disableOkBtn === void 0 ? void 0 : disableOkBtn(calendarDate);
  return /*#__PURE__*/React.createElement(Button, {
    appearance: "primary",
    size: "sm",
    disabled: disabled,
    onClick: disabled ? undefined : onOk
  }, children);
};

/**
 * Toolbar for DatePicker and DateRangePicker
 */
const Toolbar = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    className,
    classPrefix = 'picker-toolbar',
    calendarDate,
    ranges,
    locale,
    hideOkBtn,
    disableOkBtn,
    disableShortcut,
    onOk,
    onShortcutClick,
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  if (hideOkBtn && (ranges === null || ranges === void 0 ? void 0 : ranges.length) === 0) {
    return null;
  }
  const classes = merge(className, withPrefix());

  // If there are no ranges, the ok button should be aligned to the right
  const justify = (ranges === null || ranges === void 0 ? void 0 : ranges.length) === 0 ? 'flex-end' : 'space-between';
  return /*#__PURE__*/React.createElement(Stack, _extends({
    ref: ref,
    className: classes,
    justify: justify,
    align: "flex-start"
  }, rest), /*#__PURE__*/React.createElement(PredefinedRanges, {
    wrap: true,
    className: prefix('ranges'),
    ranges: ranges,
    calendarDate: calendarDate,
    locale: locale,
    disableShortcut: disableShortcut,
    onShortcutClick: onShortcutClick,
    "data-testid": "daterange-predefined-bottom"
  }), /*#__PURE__*/React.createElement("div", {
    className: prefix('right')
  }, !hideOkBtn && /*#__PURE__*/React.createElement(OkButton, {
    disableOkBtn: disableOkBtn,
    calendarDate: calendarDate,
    onOk: onOk
  }, locale === null || locale === void 0 ? void 0 : locale.ok)));
});
Toolbar.displayName = 'Toolbar';
export default Toolbar;