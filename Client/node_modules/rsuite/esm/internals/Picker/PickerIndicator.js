'use client';
import React from 'react';
import Icon from '@rsuite/icons/Icon';
import InputGroup from "../../InputGroup/index.js";
import CloseButton from "../CloseButton/index.js";
import Loader from "../../Loader/index.js";
import { useStyles, useCustom } from "../hooks/index.js";
const PickerIndicator = ({
  loading,
  caretAs,
  onClose,
  showCleanButton,
  as: Component = InputGroup.Addon,
  disabled,
  size
}) => {
  const {
    getLocale
  } = useCustom();
  const {
    clear
  } = getLocale('common');
  const {
    prefix
  } = useStyles('picker');
  const addon = () => {
    if (loading) {
      return /*#__PURE__*/React.createElement(Loader, {
        className: prefix('loader'),
        "data-testid": "spinner",
        size: size === 'xs' ? 'xs' : 'sm'
      });
    }
    if (showCleanButton && !disabled) {
      return /*#__PURE__*/React.createElement(CloseButton, {
        className: prefix('clean'),
        tabIndex: -1,
        locale: {
          closeLabel: clear
        },
        onClick: onClose
      });
    }
    return caretAs && /*#__PURE__*/React.createElement(Icon, {
      as: caretAs,
      className: prefix('caret-icon'),
      "data-testid": "caret"
    });
  };
  const props = Component === InputGroup.Addon ? {
    disabled
  } : undefined;
  return /*#__PURE__*/React.createElement(Component, props, addon());
};
export default PickerIndicator;