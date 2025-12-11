'use client';
export const convertSize = size => {
  switch (size) {
    case 'lg':
      return 'lg';
    case 'sm':
    case 'xs':
      return 'sm';
    default:
      return 'md';
  }
};