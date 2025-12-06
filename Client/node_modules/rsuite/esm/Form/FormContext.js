'use client';
import React, { useContext } from 'react';
export const FormContext = /*#__PURE__*/React.createContext({});
export const FormValueContext = /*#__PURE__*/React.createContext({});
export const FormProvider = FormContext.Provider;
export const FormValueProvider = FormValueContext.Provider;
export function useFormContext() {
  return useContext(FormContext);
}
export default FormContext;