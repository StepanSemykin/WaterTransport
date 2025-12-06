'use client';
/**
 * Transforms a numeric value into a character map array.
 */
export const transformValueToStarStatus = (value, max, allowHalf) => {
  const characterMap = [];
  for (let i = 0; i < max; i++) {
    if (i < value && value >= i + 1) {
      // Fully filled star
      characterMap.push(1);
    } else if (i < value && value < i + 1) {
      // Partially filled star
      if (allowHalf) {
        // Use 0.5 to represent partial fill when half ratings are allowed
        characterMap.push(0.5);
      } else {
        // Extract the decimal part
        characterMap.push(value - i);
      }
    } else {
      // Empty star
      characterMap.push(0);
    }
  }
  return characterMap;
};

/**
 * Transforms a character map array into a numeric value.
 */
export const transformStarStatusToValue = characterMap => characterMap.reduce((total, currentValue) => {
  return total + currentValue;
});

/**
 * Calculates the fractional part of a value as a percentage string.
 */
export const getFractionalValue = value => {
  if (!value) {
    return undefined;
  }
  const integer = Math.floor(value);
  const decimal = value - integer;

  // Round to avoid floating-point precision issues
  return decimal ? `${Math.round(decimal * 100)}%` : undefined;
};
const starStatusMap = {
  [0]: 'empty',
  [0.5]: 'half',
  [1]: 'full'
};
export const getStarStatus = status => {
  if (typeof status === 'number') {
    return starStatusMap[status] || 'frac';
  }
  return null;
};