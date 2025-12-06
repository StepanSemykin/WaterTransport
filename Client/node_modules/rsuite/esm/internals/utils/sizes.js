'use client';
import { SizeEnum, TypographySizeEnum } from "../types/index.js";
import { createStyleGetter, getCssValue } from "./style-sheet/index.js";
export const isPresetSize = size => {
  if (!size) {
    return false;
  }
  const presetSizes = [...Object.values(SizeEnum), ...Object.values(TypographySizeEnum), 'full'];
  return presetSizes.includes(size);
};
const sizeConfig = {
  prop: 'size',
  presetChecker: isPresetSize,
  valueTransformer: getCssValue
};
export const getSizeValue = (type, size) => {
  if (isPresetSize(size)) {
    return `var(--rs-${type}-${size})`;
  }
  return getCssValue(size);
};
export const getSizeStyle = createStyleGetter(sizeConfig);
const lineHeightConfig = {
  prop: 'line-height',
  presetChecker: isPresetSize,
  valueTransformer: value => isPresetSize(value) ? value : null
};
export const getLineHeightStyle = createStyleGetter(lineHeightConfig);