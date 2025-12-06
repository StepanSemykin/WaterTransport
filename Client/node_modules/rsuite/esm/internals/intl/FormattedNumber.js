'use client';
import React, { useMemo } from 'react';
import { useCustom } from "../hooks/index.js";
export function FormattedNumber({
  value,
  formatOptions
}) {
  const {
    code
  } = useCustom();
  const formatter = useMemo(() => new Intl.NumberFormat(code, formatOptions), [code, formatOptions]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, formatter.format(value));
}