'use client';
import React, { useContext } from 'react';
export const DateRangePickerContext = /*#__PURE__*/React.createContext({});
export const useDateRangePickerContext = () => {
  return useContext(DateRangePickerContext) || {};
};
export const DateRangePickerProvider = DateRangePickerContext.Provider;