'use client';
import { useMemo } from 'react';
import { useEventCallback } from "../../internals/hooks/index.js";
import { addMonths } from "../../internals/utils/date/index.js";
export function useCalendarHandlers({
  index,
  calendarDateRange,
  onChangeCalendarMonth,
  onChangeCalendarTime,
  onSelect
}) {
  const calendarDate = useMemo(() => calendarDateRange[index], [calendarDateRange, index]);
  const handleSelect = useEventCallback((date, event) => {
    onSelect === null || onSelect === void 0 || onSelect(index, date, event);
  });
  const handleChangeMonth = useEventCallback(nextPageDate => {
    onChangeCalendarMonth === null || onChangeCalendarMonth === void 0 || onChangeCalendarMonth(index, nextPageDate);
  });
  const handleChangeTime = useEventCallback(nextPageDate => {
    onChangeCalendarTime === null || onChangeCalendarTime === void 0 || onChangeCalendarTime(index, nextPageDate);
  });
  const handleMoveForward = useEventCallback(() => {
    onChangeCalendarMonth === null || onChangeCalendarMonth === void 0 || onChangeCalendarMonth(index, addMonths(calendarDate, 1));
  });
  const handleMoveBackward = useEventCallback(() => {
    onChangeCalendarMonth === null || onChangeCalendarMonth === void 0 || onChangeCalendarMonth(index, addMonths(calendarDate, -1));
  });
  return {
    calendarDate,
    onSelect: handleSelect,
    onChangeMonth: handleChangeMonth,
    onChangeTime: handleChangeTime,
    onMoveForward: handleMoveForward,
    onMoveBackward: handleMoveBackward
  };
}
export default useCalendarHandlers;