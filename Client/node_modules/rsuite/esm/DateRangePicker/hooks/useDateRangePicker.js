'use client';
import { useContext } from 'react';
import { DateRangePickerContext } from "../DateRangePickerProvider.js";
export const useDateRangePicker = () => {
  return useContext(DateRangePickerContext) || {};
};