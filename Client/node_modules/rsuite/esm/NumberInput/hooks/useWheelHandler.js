'use client';
import { useEffect } from 'react';
import on from 'dom-lib/on';

/**
 * Attach wheel listener to inputRef.
 */
export function useWheelHandler(inputRef, handleWheel, scrollable) {
  useEffect(() => {
    let wheelListener;
    if (inputRef.current) {
      wheelListener = on(inputRef.current, 'wheel', handleWheel, {
        passive: false
      });
    }
    return () => {
      var _wheelListener;
      (_wheelListener = wheelListener) === null || _wheelListener === void 0 || _wheelListener.off();
    };
  }, [inputRef, handleWheel, scrollable]);
}