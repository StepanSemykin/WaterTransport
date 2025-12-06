'use client';
import delay from 'lodash/delay';
import { addMonths } from 'date-fns/addMonths';
import { addDays } from 'date-fns/addDays';
import { useEventCallback, useCustom } from "../../internals/hooks/index.js";
import { getAriaLabel } from "../../Calendar/utils/index.js";
import { onMenuKeyDown } from "../../internals/Picker/utils.js";
function useFocus(props) {
  const {
    target,
    showMonth,
    id,
    locale: localeProp
  } = props;
  const {
    getLocale,
    formatDate
  } = useCustom();
  const {
    formattedMonthPattern,
    formattedDayPattern
  } = getLocale('DateTimeFormats', localeProp);

  /**
   * Get the corresponding container based on date selection and month selection
   */
  const getOverlayContainer = () => {
    return showMonth ? document.getElementById(`${id}-calendar-month-dropdown`) : document.getElementById(`${id}-calendar-table`);
  };

  /**
   * Check whether the date is focusable
   */
  const checkFocusable = date => {
    const formatStr = showMonth ? formattedMonthPattern : formattedDayPattern;
    const ariaLabel = getAriaLabel(date, formatStr, formatDate);
    const container = getOverlayContainer();
    const dateElement = container === null || container === void 0 ? void 0 : container.querySelector(`[aria-label="${ariaLabel}"]`);
    if ((dateElement === null || dateElement === void 0 ? void 0 : dateElement.getAttribute('aria-disabled')) === 'true') {
      return false;
    }
    return true;
  };

  /**
   * Focus on the currently selected date element
   */
  const focusSelectedDate = () => {
    delay(() => {
      const container = getOverlayContainer();
      const selectedElement = container === null || container === void 0 ? void 0 : container.querySelector('[aria-selected="true"]');
      selectedElement === null || selectedElement === void 0 || selectedElement.focus();
    }, 1);
  };

  /**
   * Focus on the input element
   */
  const focusInput = useEventCallback(() => {
    delay(() => {
      var _target$current;
      return (_target$current = target.current) === null || _target$current === void 0 ? void 0 : _target$current.focus();
    }, 1);
  });
  const onKeyFocusEvent = useEventCallback((event, options) => {
    const {
      date,
      callback
    } = options;
    let delta = 0;
    const step = showMonth ? 6 : 7;
    const changeDateFunc = showMonth ? addMonths : addDays;
    onMenuKeyDown(event, {
      down: () => {
        delta = step;
      },
      up: () => {
        delta = -step;
      },
      right: () => {
        delta = 1;
      },
      left: () => {
        delta = -1;
      }
    });
    const nextDate = changeDateFunc(date, delta);
    if (checkFocusable(nextDate)) {
      callback(nextDate);
      focusSelectedDate();
    }
  });
  return {
    focusInput,
    focusSelectedDate,
    onKeyFocusEvent
  };
}
export default useFocus;