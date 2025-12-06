'use client';
import { useContext } from 'react';
import { ComboboxContext } from "../PickerToggleTrigger.js";
function useCombobox() {
  const {
    id,
    hasLabel,
    popupType,
    multiple,
    placement,
    breakpoint
  } = useContext(ComboboxContext);
  return {
    id,
    popupType,
    multiple,
    placement,
    breakpoint,
    labelId: hasLabel ? `${id}-label` : undefined
  };
}
export default useCombobox;