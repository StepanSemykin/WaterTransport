'use client';
import { useState, useCallback, useEffect } from 'react';
import { transformValueToStarStatus, transformStarStatusToValue } from "./utils.js";
/**
 * Custom hook to manage rating star states for Rate component
 */
export const useRatingStates = ({
  value,
  max,
  allowHalf,
  valueProp
}) => {
  // Create a function to generate star states based on value
  const getStarStates = useCallback(v => {
    return transformValueToStarStatus(typeof v !== 'undefined' ? v : value, max, allowHalf);
  }, [allowHalf, max, value]);

  // Initialize star states
  const [starStates, setStarStates] = useState(getStarStates());

  // Calculate hover value from star states
  const hoverValue = transformStarStatusToValue(starStates);

  // Function to reset star states to current value
  const resetStarStates = useCallback(() => {
    setStarStates(getStarStates());
  }, [getStarStates]);

  // Update star states when value prop changes
  useEffect(() => {
    if (typeof valueProp !== 'undefined') {
      setStarStates(getStarStates(valueProp));
    }
  }, [valueProp, getStarStates]);
  return {
    starStates,
    setStarStates,
    resetStarStates,
    hoverValue,
    getStarStates
  };
};