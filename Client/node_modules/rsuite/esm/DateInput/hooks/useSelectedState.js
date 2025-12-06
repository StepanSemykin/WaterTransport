'use client';
import { useState } from 'react';
const defaultSelectedState = {
  selectedPattern: 'y',
  selectionStart: 0,
  selectionEnd: 0
};
export function useSelectedState() {
  const [selectedState, setSelectedState] = useState(defaultSelectedState);
  return {
    selectedState,
    setSelectedState
  };
}
export default useSelectedState;