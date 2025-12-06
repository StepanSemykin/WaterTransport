'use client';
import { useEffect, useRef } from 'react';
export function useClickOutside({
  enabled = true,
  isOutside,
  handle
}) {
  const isOutsideRef = useRef(isOutside);
  const handleRef = useRef(handle);
  useEffect(() => {
    isOutsideRef.current = isOutside;
    handleRef.current = handle;
  }, [isOutside, handle]);
  useEffect(() => {
    if (enabled) {
      const eventHandler = event => {
        var _isOutsideRef$current;
        if ((_isOutsideRef$current = isOutsideRef.current) !== null && _isOutsideRef$current !== void 0 && _isOutsideRef$current.call(isOutsideRef, event)) {
          var _handleRef$current;
          (_handleRef$current = handleRef.current) === null || _handleRef$current === void 0 || _handleRef$current.call(handleRef, event);
        }
      };
      window.addEventListener('mousedown', eventHandler);
      return () => {
        window.removeEventListener('mousedown', eventHandler);
      };
    }
  }, [enabled]);
}
export default useClickOutside;