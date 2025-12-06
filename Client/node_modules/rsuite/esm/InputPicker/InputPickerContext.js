'use client';
import React from 'react';
const InputPickerContext = /*#__PURE__*/React.createContext({
  tagProps: {},
  trigger: 'Enter'
});
export function useTagContext() {
  return React.useContext(InputPickerContext);
}
export const TagProvider = InputPickerContext.Provider;
export default InputPickerContext;