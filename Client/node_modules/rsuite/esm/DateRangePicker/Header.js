'use client';
import React from 'react';
import { useStyles } from "../internals/hooks/index.js";
import { compareAsc } from "../internals/utils/date/index.js";
import { FormattedDate } from "../internals/intl/FormattedDate.js";
import Button from "../Button/index.js";
function Header(props) {
  const {
    prefix
  } = useStyles('picker');
  const {
    formatStr,
    character,
    value,
    activeKey = 'start',
    clickable,
    onSelect
  } = props;
  const [startDate, endDate] = value !== null && value !== void 0 ? value : [null, null];
  const v = startDate && endDate ? [startDate, endDate].sort(compareAsc) : [startDate, endDate];
  const start = v[0] ? /*#__PURE__*/React.createElement(FormattedDate, {
    date: v[0],
    formatStr: formatStr
  }) : formatStr;
  const end = v[1] ? /*#__PURE__*/React.createElement(FormattedDate, {
    date: v[1],
    formatStr: formatStr
  }) : formatStr;
  return /*#__PURE__*/React.createElement("div", {
    className: prefix('daterange-header', {
      [`tab-active-${activeKey}`]: clickable
    }),
    "data-testid": "daterange-header"
  }, clickable ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    size: "xs",
    appearance: "subtle",
    className: prefix('header-date'),
    onClick: () => onSelect === null || onSelect === void 0 ? void 0 : onSelect('start'),
    "aria-label": "Select start date"
  }, start), /*#__PURE__*/React.createElement("span", {
    className: prefix('header-character')
  }, character), /*#__PURE__*/React.createElement(Button, {
    size: "xs",
    appearance: "subtle",
    className: prefix('header-date'),
    onClick: () => onSelect === null || onSelect === void 0 ? void 0 : onSelect('end'),
    "aria-label": "Select end date"
  }, end)) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: prefix('header-date')
  }, start), /*#__PURE__*/React.createElement("span", {
    className: prefix('header-character')
  }, character), /*#__PURE__*/React.createElement("span", {
    className: prefix('header-date')
  }, end)));
}
export default Header;