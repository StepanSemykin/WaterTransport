'use client';
import { useImperativeHandle, useRef } from 'react';
import { useEventCallback } from "../../hooks/index.js";
import { RSUITE_PICKER_TYPE } from "../../symbols.js";
/**
 * A hook of the exposed method of Picker
 */
function usePickerRef(ref) {
  const trigger = useRef(null);
  const root = useRef(null);
  const target = useRef(null);
  const overlay = useRef(null);
  const list = useRef(null);
  const searchInput = useRef(null);
  const treeView = useRef(null);
  const handleOpen = useEventCallback(() => {
    var _trigger$current;
    trigger === null || trigger === void 0 || (_trigger$current = trigger.current) === null || _trigger$current === void 0 || _trigger$current.open();
  });
  const handleClose = useEventCallback(() => {
    var _trigger$current2;
    trigger === null || trigger === void 0 || (_trigger$current2 = trigger.current) === null || _trigger$current2 === void 0 || _trigger$current2.close();
  });
  const handleUpdatePosition = useEventCallback(() => {
    var _trigger$current3;
    trigger === null || trigger === void 0 || (_trigger$current3 = trigger.current) === null || _trigger$current3 === void 0 || _trigger$current3.updatePosition();
  });
  useImperativeHandle(ref, () => {
    return {
      get root() {
        var _ref, _trigger$current4;
        return (_ref = (root === null || root === void 0 ? void 0 : root.current) || (trigger === null || trigger === void 0 || (_trigger$current4 = trigger.current) === null || _trigger$current4 === void 0 ? void 0 : _trigger$current4.root)) !== null && _ref !== void 0 ? _ref : null;
      },
      get overlay() {
        var _overlay$current;
        if (!(overlay !== null && overlay !== void 0 && overlay.current)) {
          throw new Error('The overlay is not found. Please confirm whether the picker is open.');
        }
        return (_overlay$current = overlay === null || overlay === void 0 ? void 0 : overlay.current) !== null && _overlay$current !== void 0 ? _overlay$current : null;
      },
      get target() {
        var _target$current;
        return (_target$current = target === null || target === void 0 ? void 0 : target.current) !== null && _target$current !== void 0 ? _target$current : null;
      },
      get list() {
        if (!(list !== null && list !== void 0 && list.current)) {
          throw new Error(`
            The list is not found.
            1.Please set virtualized for the component.
            2.Please confirm whether the picker is open.
          `);
        }
        return list === null || list === void 0 ? void 0 : list.current;
      },
      type: RSUITE_PICKER_TYPE,
      updatePosition: handleUpdatePosition,
      open: handleOpen,
      close: handleClose
    };
  });
  return {
    trigger,
    root,
    overlay,
    target,
    list,
    searchInput,
    treeView
  };
}
export default usePickerRef;