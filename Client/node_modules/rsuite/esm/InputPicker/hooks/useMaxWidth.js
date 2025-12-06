'use client';
import { useState, useEffect } from 'react';
import getWidth from 'dom-lib/getWidth';
function useMaxWidth(triggerRef) {
  const [maxWidth, setMaxWidth] = useState(100);
  useEffect(() => {
    var _triggerRef$current;
    // In multiple selection, you need to set a maximum width for the input.
    if ((_triggerRef$current = triggerRef.current) !== null && _triggerRef$current !== void 0 && _triggerRef$current.root) {
      var _triggerRef$current2;
      setMaxWidth(getWidth((_triggerRef$current2 = triggerRef.current) === null || _triggerRef$current2 === void 0 ? void 0 : _triggerRef$current2.root));
    }
  }, []);
  return maxWidth;
}
export default useMaxWidth;