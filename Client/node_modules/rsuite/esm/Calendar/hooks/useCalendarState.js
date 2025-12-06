'use client';
import { useMemo, useState } from 'react';
import { addMonths } from "../../internals/utils/date/index.js";
import { useEventCallback } from "../../internals/hooks/index.js";
export let CalendarState = /*#__PURE__*/function (CalendarState) {
  CalendarState["TIME"] = "TIME";
  CalendarState["MONTH"] = "MONTH";
  return CalendarState;
}({});
export const useCalendarState = props => {
  const [calendarState, setCalendarState] = useState(props.defaultState);
  const reset = useEventCallback(() => {
    setCalendarState(undefined);
    if (calendarState === CalendarState.TIME) {
      var _props$onToggleTimeDr;
      (_props$onToggleTimeDr = props.onToggleTimeDropdown) === null || _props$onToggleTimeDr === void 0 || _props$onToggleTimeDr.call(props, false);
    } else if (calendarState === CalendarState.MONTH) {
      var _props$onToggleMonthD;
      (_props$onToggleMonthD = props.onToggleMonthDropdown) === null || _props$onToggleMonthD === void 0 || _props$onToggleMonthD.call(props, false);
    }
  });
  const onMoveForward = useEventCallback(() => {
    var _props$onMoveForward;
    (_props$onMoveForward = props.onMoveForward) === null || _props$onMoveForward === void 0 || _props$onMoveForward.call(props, addMonths(props.calendarDate, 1));
  });
  const onMoveBackward = useEventCallback(() => {
    var _props$onMoveBackward;
    (_props$onMoveBackward = props.onMoveBackward) === null || _props$onMoveBackward === void 0 || _props$onMoveBackward.call(props, addMonths(props.calendarDate, -1));
  });
  const onToggleTimeDropdown = useEventCallback(() => {
    var _props$onToggleTimeDr2;
    if (calendarState === CalendarState.TIME) {
      setCalendarState(undefined);
    } else {
      setCalendarState(CalendarState.TIME);
    }
    (_props$onToggleTimeDr2 = props.onToggleTimeDropdown) === null || _props$onToggleTimeDr2 === void 0 || _props$onToggleTimeDr2.call(props, calendarState !== CalendarState.TIME);
  });
  const onToggleMonthDropdown = useEventCallback(() => {
    var _props$onToggleMonthD2;
    if (calendarState === CalendarState.MONTH) {
      setCalendarState(undefined);
    } else {
      setCalendarState(CalendarState.MONTH);
    }
    (_props$onToggleMonthD2 = props.onToggleMonthDropdown) === null || _props$onToggleMonthD2 === void 0 || _props$onToggleMonthD2.call(props, calendarState !== CalendarState.MONTH);
  });
  const handlers = useMemo(() => {
    return {
      onMoveForward,
      onMoveBackward,
      onToggleTimeDropdown,
      onToggleMonthDropdown
    };
  }, [onMoveBackward, onMoveForward, onToggleMonthDropdown, onToggleTimeDropdown]);
  return {
    calendarState,
    handlers,
    reset
  };
};