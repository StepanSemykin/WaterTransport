'use client';
/**
 * @description escape Regular_Expressions special_characters '^$.|*+?{\\[()'
 */
export function getSafeRegExpString(str) {
  const specialChars = '\\^$.|?*+()[]{}';
  return str.replace(new RegExp(`([${specialChars}])`, 'g'), '\\$1');
}