'use client';
import { useRef } from 'react';
import { contains, ownerDocument } from 'dom-lib';
import { useIsomorphicLayoutEffect, useUpdateEffect, useEventCallback } from "../internals/hooks/index.js";
import { RSUITE_PICKER_TYPE } from "../internals/symbols.js";
const useFocusEvent = ({
  isEditing,
  stateOnBlur,
  onSave,
  onCancel
}) => {
  var _ref$current;
  const ref = useRef(null);
  const rootRef = useRef(null);
  const isPicker = ((_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : _ref$current.type) === RSUITE_PICKER_TYPE;
  const focus = () => {
    if (isPicker) {
      setTimeout(() => {
        var _picker$target, _picker$target$focus, _picker$open;
        const picker = ref.current;
        // Auto focus the search input
        picker === null || picker === void 0 || (_picker$target = picker.target) === null || _picker$target === void 0 || (_picker$target$focus = _picker$target.focus) === null || _picker$target$focus === void 0 || _picker$target$focus.call(_picker$target);

        // Open the picker
        picker === null || picker === void 0 || (_picker$open = picker.open) === null || _picker$open === void 0 || _picker$open.call(picker);
      }, 100);
    } else {
      var _ref$current2, _ref$current2$focus;
      (_ref$current2 = ref.current) === null || _ref$current2 === void 0 || (_ref$current2$focus = _ref$current2.focus) === null || _ref$current2$focus === void 0 || _ref$current2$focus.call(_ref$current2);
    }
  };
  const handleBlur = useEventCallback(event => {
    if (event) {
      var _event$relatedTarget;
      const relatedTarget = (_event$relatedTarget = event.relatedTarget) !== null && _event$relatedTarget !== void 0 ? _event$relatedTarget : ownerDocument(event.currentTarget).activeElement;
      if (rootRef.current && contains(rootRef.current, relatedTarget)) {
        return;
      }
    }
    if (stateOnBlur === 'save') {
      onSave === null || onSave === void 0 || onSave(event);
    } else if (stateOnBlur === 'cancel') {
      onCancel === null || onCancel === void 0 || onCancel(event);
    }
  });
  useIsomorphicLayoutEffect(() => {
    if (isEditing) {
      focus();
    }
  }, []);
  useUpdateEffect(() => {
    if (isEditing) {
      focus();
    }
  }, [isEditing]);
  return {
    target: ref,
    root: rootRef,
    onBlur: handleBlur
  };
};
export default useFocusEvent;