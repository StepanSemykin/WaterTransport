'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import Icon from '@rsuite/icons/Icon';
import ArrowDownLineIcon from '@rsuite/icons/ArrowDownLine';
import { useStyles } from "../internals/hooks/index.js";
const AccordionButton = props => {
  const {
    classPrefix = 'panel-btn',
    expanded,
    id,
    className,
    controlId,
    children,
    disabled,
    caretAs = ArrowDownLineIcon,
    ...rest
  } = props;
  const {
    prefix,
    withPrefix
  } = useStyles(classPrefix);
  return /*#__PURE__*/React.createElement("button", _extends({
    id: id,
    type: "button",
    "aria-controls": controlId,
    "aria-expanded": expanded,
    "aria-disabled": disabled,
    className: withPrefix(className),
    disabled: disabled
  }, rest), children, /*#__PURE__*/React.createElement(Icon, {
    as: caretAs,
    "aria-hidden": "true",
    className: prefix`icon`,
    "data-testid": "caret icon"
  }));
};
export default AccordionButton;