'use client';
import { useState } from 'react';
import { useEventCallback } from "../../internals/hooks/index.js";
function useMonthView(props) {
  const {
    onToggleMonthDropdown
  } = props;
  const [monthView, setMonthView] = useState(false);

  /**
   * The callback triggered after the month selection box is opened or closed.
   */
  const toggleMonthView = useEventCallback(show => {
    onToggleMonthDropdown === null || onToggleMonthDropdown === void 0 || onToggleMonthDropdown(show);
    setMonthView(show);
  });
  return {
    monthView,
    setMonthView,
    toggleMonthView
  };
}
export default useMonthView;