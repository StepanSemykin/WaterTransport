'use client';
import React from 'react';
import Badge from "../../Badge/index.js";
import { reactToString } from "../utils/index.js";
const SelectedElement = props => {
  const {
    selectedItems,
    prefix,
    valueKey,
    labelKey,
    childrenKey = 'children',
    countable,
    cascade,
    locale,
    badgeSize
  } = props;
  const count = selectedItems.length;
  let title = '';
  if (count) {
    title = selectedItems.map(item => {
      const label = item[labelKey];
      if (typeof label === 'string' || typeof label === 'number') {
        return label;
      } else if (/*#__PURE__*/React.isValidElement(label)) {
        return reactToString(label).join('');
      }
      return '';
    }).join(', ');
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: prefix('value-list'),
    title: title
  }, selectedItems.map((item, index) => {
    const checkAll = cascade && (item.checkAll || item[childrenKey]);
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: item[valueKey]
    }, /*#__PURE__*/React.createElement("span", {
      className: prefix('value-item')
    }, item[labelKey], checkAll && locale !== null && locale !== void 0 && locale.checkAll ? ` (${locale.checkAll})` : ''), index === count - 1 ? null : /*#__PURE__*/React.createElement("span", {
      className: prefix('value-separator')
    }, ","));
  })), countable ? /*#__PURE__*/React.createElement(Badge, {
    className: prefix('value-count'),
    title: `${count}`,
    content: count > 99 ? '99+' : count,
    size: badgeSize
  }) : null);
};
export default SelectedElement;