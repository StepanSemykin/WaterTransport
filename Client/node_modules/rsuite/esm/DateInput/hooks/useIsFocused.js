'use client';
import { useState, useCallback } from 'react';
export function useIsFocused({
  onFocus: onFocusProp,
  onBlur: onBlurProp
}) {
  const [isFocused, setIsFocused] = useState(false);
  const onFocus = useCallback(event => {
    setIsFocused(true);
    onFocusProp === null || onFocusProp === void 0 || onFocusProp(event);
  }, [onFocusProp]);
  const onBlur = useCallback(event => {
    setIsFocused(false);
    onBlurProp === null || onBlurProp === void 0 || onBlurProp(event);
  }, [onBlurProp]);
  return [isFocused, {
    onFocus,
    onBlur
  }];
}
export default useIsFocused;