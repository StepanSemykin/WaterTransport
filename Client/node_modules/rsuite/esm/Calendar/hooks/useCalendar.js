'use client';
import { useContext, useMemo } from 'react';
import { CalendarContext } from "../CalendarProvider.js";
export const useCalendar = () => {
  var _locale$dateLocale2;
  const {
    locale,
    showWeekNumbers,
    isoWeek,
    weekStart: weekStartProp,
    ...rest
  } = useContext(CalendarContext);

  // Determine the start of the week based on various conditions
  const weekStart = useMemo(() => {
    var _locale$dateLocale;
    // If weekStartProp is explicitly provided, use it
    if (typeof weekStartProp !== 'undefined') {
      return weekStartProp;
    }
    // If using ISO week, start on Monday (1)
    else if (isoWeek) {
      return 1;
    }
    // If locale specifies a weekStartsOn option, use it
    else if ((locale === null || locale === void 0 || (_locale$dateLocale = locale.dateLocale) === null || _locale$dateLocale === void 0 || (_locale$dateLocale = _locale$dateLocale.options) === null || _locale$dateLocale === void 0 ? void 0 : _locale$dateLocale.weekStartsOn) !== undefined) {
      return locale.dateLocale.options.weekStartsOn;
    }
    // Default to Sunday (0) if no other condition is met
    return 0;
  }, [weekStartProp, isoWeek, locale === null || locale === void 0 || (_locale$dateLocale2 = locale.dateLocale) === null || _locale$dateLocale2 === void 0 || (_locale$dateLocale2 = _locale$dateLocale2.options) === null || _locale$dateLocale2 === void 0 ? void 0 : _locale$dateLocale2.weekStartsOn]);
  return {
    locale,
    showWeekNumbers,
    isoWeek,
    weekStart,
    ...rest
  };
};