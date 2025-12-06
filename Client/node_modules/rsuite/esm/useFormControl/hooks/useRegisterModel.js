'use client';
import { useRef, useEffect } from 'react';
import { useFormContext } from "../../Form/FormContext.js";
export function useRegisterModel(name, rule) {
  const {
    pushFieldRule,
    removeFieldRule
  } = useFormContext() || {};
  const refRule = useRef(rule);
  refRule.current = rule;
  useEffect(() => {
    pushFieldRule === null || pushFieldRule === void 0 || pushFieldRule(name, refRule);
    return () => {
      removeFieldRule === null || removeFieldRule === void 0 || removeFieldRule(name);
    };
  }, [name, pushFieldRule, removeFieldRule]);
}