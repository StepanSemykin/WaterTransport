'use client';
import { useMemo, useCallback } from 'react';
import isNil from 'lodash/isNil';
export function useNumberInputValue(params) {
  const {
    value,
    isFocused,
    formatter,
    decimalSeparator
  } = params;
  const replaceDecimalSeparator = useCallback(val => {
    if (decimalSeparator && val != null) {
      return val.toString().replace('.', decimalSeparator);
    }
    return val;
  }, [decimalSeparator]);
  return useMemo(() => {
    if (isNil(value)) {
      return '';
    }
    if (isFocused) {
      return replaceDecimalSeparator(value);
    }
    if (formatter) {
      return formatter(value);
    }
    return replaceDecimalSeparator(value);
  }, [formatter, isFocused, replaceDecimalSeparator, value]);
}