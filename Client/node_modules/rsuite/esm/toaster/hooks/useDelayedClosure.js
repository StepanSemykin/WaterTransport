'use client';
import { useContext, useRef } from 'react';
import on from 'dom-lib/on';
import { useTimeout, useMount } from "../../internals/hooks/index.js";
import ToastContext from "../ToastContext.js";
/**
 * A hook that delays the closure of the message box.
 */
function useDelayedClosure(props) {
  const {
    onClose,
    duration: durationProp,
    targetRef
  } = props;
  const {
    usedToaster,
    duration = durationProp,
    mouseReset
  } = useContext(ToastContext);
  const mouseEnterRef = useRef(null);
  const mouseLeaveRef = useRef(null);
  const {
    clear,
    reset
  } = useTimeout(onClose, duration, usedToaster && duration > 0);
  useMount(() => {
    if (targetRef !== null && targetRef !== void 0 && targetRef.current && mouseReset) {
      if (mouseEnterRef.current || mouseLeaveRef.current) {
        return;
      }
      mouseEnterRef.current = on(targetRef.current, 'mouseenter', clear);
      mouseLeaveRef.current = on(targetRef.current, 'mouseleave', reset);
      return () => {
        var _mouseEnterRef$curren, _mouseLeaveRef$curren;
        (_mouseEnterRef$curren = mouseEnterRef.current) === null || _mouseEnterRef$curren === void 0 || _mouseEnterRef$curren.off();
        (_mouseLeaveRef$curren = mouseLeaveRef.current) === null || _mouseLeaveRef$curren === void 0 || _mouseLeaveRef$curren.off();
      };
    }
  });
  return {
    clear,
    reset
  };
}
export default useDelayedClosure;