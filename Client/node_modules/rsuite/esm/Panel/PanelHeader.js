'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { isValidElement, cloneElement } from 'react';
import get from 'lodash/get';
import AccordionButton from "./AccordionButton.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { isFragment } from "../internals/utils/index.js";
const PanelHeader = props => {
  const {
    as = 'div',
    classPrefix = 'panel',
    className,
    children,
    collapsible,
    caretAs,
    disabled,
    expanded,
    role,
    bodyId,
    buttonId,
    onClickButton,
    ...rest
  } = props;
  const {
    merge,
    prefix
  } = useStyles(classPrefix);
  let headerElement;
  if (! /*#__PURE__*/isValidElement(children) || Array.isArray(children) || isFragment(children)) {
    headerElement = /*#__PURE__*/React.createElement("div", {
      className: prefix('title')
    }, children);
  } else {
    const className = merge(prefix('title'), get(children, 'props.className'));
    headerElement = /*#__PURE__*/cloneElement(children, {
      className
    });
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: as,
    className: merge(className, prefix('header'))
  }, rest), collapsible ? /*#__PURE__*/React.createElement(AccordionButton, {
    id: buttonId,
    role: role,
    caretAs: caretAs,
    controlId: bodyId,
    disabled: disabled,
    expanded: expanded,
    onClick: onClickButton
  }, headerElement) : headerElement);
};
export default PanelHeader;