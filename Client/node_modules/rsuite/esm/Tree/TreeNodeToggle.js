'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import ArrowDownIcon from '@rsuite/icons/ArrowDown';
import ArrowRightIcon from '@rsuite/icons/ArrowRight';
import ArrowLeftIcon from '@rsuite/icons/ArrowLeft';
import Spinner from '@rsuite/icons/Spinner';
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { useTreeCustomRenderer } from "../internals/Tree/TreeProvider.js";
function TreeNodeToggle(props) {
  const {
    data,
    loading,
    expanded,
    hasChildren,
    ...rest
  } = props;
  const {
    rtl
  } = useCustom();
  const {
    renderTreeIcon
  } = useTreeCustomRenderer();
  const {
    prefix
  } = useStyles('tree-node');
  const IconElementType = expanded ? ArrowDownIcon : rtl ? ArrowLeftIcon : ArrowRightIcon;
  let icon = /*#__PURE__*/React.createElement(IconElementType, {
    className: prefix('toggle-icon')
  });
  if (loading) {
    icon = /*#__PURE__*/React.createElement("div", {
      className: prefix('loading-icon')
    }, /*#__PURE__*/React.createElement(Spinner, {
      spin: true
    }));
  }
  if (data !== undefined && typeof renderTreeIcon === 'function') {
    const customIcon = renderTreeIcon(data, expanded);
    icon = customIcon !== null ? /*#__PURE__*/React.createElement("div", {
      className: prefix('custom-icon')
    }, customIcon) : icon;
  }
  return hasChildren ? /*#__PURE__*/React.createElement("div", _extends({
    tabIndex: -1,
    role: "button",
    "aria-busy": loading ? true : undefined,
    "data-ref": data.refKey,
    className: prefix('toggle')
  }, rest), icon) : /*#__PURE__*/React.createElement("div", {
    className: prefix('toggle-placeholder')
  });
}
export default TreeNodeToggle;