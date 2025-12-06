'use client';
export const formatWithLeadingZero = number => {
  return String(number).padStart(2, '0');
};