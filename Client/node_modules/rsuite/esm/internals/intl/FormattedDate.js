'use client';
import React from 'react';
import { useCustom } from "../hooks/index.js";
export function FormattedDate({
  date,
  formatStr
}) {
  const {
    formatDate
  } = useCustom('Calendar');
  return /*#__PURE__*/React.createElement(React.Fragment, null, formatDate(date, formatStr));
}
export default FormattedDate;