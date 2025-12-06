'use client';
import { useState } from 'react';
import { useEventCallback, useControlled } from "../internals/hooks/index.js";
const useEditState = props => {
  const {
    value: valueProp,
    defaultValue,
    disabled,
    onChange,
    onEdit,
    onCancel,
    onSave,
    onClick,
    onFocus,
    ...htmlProps
  } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useControlled(valueProp, defaultValue);

  // When editing, the value is not updated, and the original value is restored when canceling
  const [resetValue, setResetValue] = useState();
  const handleClick = useEventCallback(event => {
    if (disabled) {
      return;
    }
    onClick === null || onClick === void 0 || onClick(event);
    onEdit === null || onEdit === void 0 || onEdit(event);
    setIsEditing(true);
    setResetValue(value);
  });
  const handleFocus = useEventCallback(event => {
    if (disabled || isEditing) return;
    onFocus === null || onFocus === void 0 || onFocus(event);
    setIsEditing(true);
    setResetValue(value);
  });
  const handleChange = useEventCallback((value, event) => {
    setValue(value);
    onChange === null || onChange === void 0 || onChange(value, event);
  });
  const handleCancel = useEventCallback(event => {
    var _event$stopPropagatio;
    setIsEditing(false);
    setValue(resetValue);
    onCancel === null || onCancel === void 0 || onCancel(event);
    event === null || event === void 0 || (_event$stopPropagatio = event.stopPropagation) === null || _event$stopPropagatio === void 0 || _event$stopPropagatio.call(event);
  });
  const handleSave = useEventCallback(event => {
    var _event$stopPropagatio2;
    setIsEditing(false);
    onSave === null || onSave === void 0 || onSave(event);
    event === null || event === void 0 || (_event$stopPropagatio2 = event.stopPropagation) === null || _event$stopPropagatio2 === void 0 || _event$stopPropagatio2.call(event);
  });
  const handleKeyDown = useEventCallback(event => {
    var _event$target;
    if (isEditing) {
      switch (event.key) {
        case 'Enter':
          if (((_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.tagName) === 'INPUT') {
            handleSave(event);
          }
          break;
        case 'Escape':
          handleCancel(event);
          break;
      }
    }
  });
  return {
    isEditing,
    value,
    onClick: handleClick,
    onChange: handleChange,
    onFocus: handleFocus,
    onCancel: handleCancel,
    onSave: handleSave,
    onKeyDown: handleKeyDown,
    htmlProps
  };
};
export default useEditState;