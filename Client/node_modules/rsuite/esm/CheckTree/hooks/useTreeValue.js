'use client';
import { useControlled, useMount } from "../../internals/hooks/index.js";
import { getCheckTreeDefaultValue } from "../utils.js";
function useTreeValue(controlledValue, {
  defaultValue,
  uncheckableItemValues
}) {
  const [value, setValue, isControlled] = useControlled(controlledValue, defaultValue);
  useMount(() => {
    setValue(getCheckTreeDefaultValue(value, uncheckableItemValues));
  });
  return [value, setValue, isControlled];
}
export default useTreeValue;