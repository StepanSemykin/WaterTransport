'use client';
import camelCase from 'lodash/camelCase';
import { cssSystemPropAlias } from "../styled-system/index.js";
import { isCSSProperty } from "../utils/index.js";
const getUsedPropKeys = () => {
  const propSet = new Set();
  Object.entries(cssSystemPropAlias).forEach(([key, prop]) => {
    const {
      property
    } = prop;
    const propName = camelCase(property);
    propSet.add(key);
    propSet.add(propName);
  });
  return Array.from(propSet);
};

/**
 * Extract box properties from props
 * @param props Original props object
 * @returns Object containing only box properties
 */
export const extractBoxProps = props => {
  const boxPropKeys = getUsedPropKeys();
  const boxProps = {};

  // Extract only box related properties
  Object.keys(props).forEach(key => {
    if (boxPropKeys.includes(key) && props[key] !== undefined) {
      boxProps[key] = props[key];
    } else if (isCSSProperty(key)) {
      boxProps[key] = props[key];
    }
  });
  return boxProps;
};

/**
 * Filter out layout properties from props
 * @param props Original props object
 * @returns New object without layout properties
 */
export const omitBoxProps = props => {
  const boxPropKeys = getUsedPropKeys();
  const filteredProps = {};

  // Copy all properties except box related ones
  Object.keys(props).forEach(key => {
    if (!boxPropKeys.includes(key)) {
      filteredProps[key] = props[key];
    }
  });
  return filteredProps;
};