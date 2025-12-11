'use client';
export const createStyleValueSetter = config => {
  const {
    valueTransformer: t,
    presetChecker,
    useGlobalVar
  } = config;
  return (value, name, prop = config.prop) => {
    if (typeof value === 'undefined' || !name) {
      return;
    }
    if (presetChecker !== null && presetChecker !== void 0 && presetChecker(value)) {
      return useGlobalVar ? `var(--rs-${prop}-${value})` : `var(--rs-${name}-${prop}-${value})`;
    } else if (Array.isArray(value)) {
      // If value is an array, join it with spaces,
      // .eg, gap=[10, 20] -> '10px 20px'
      return value.map(item => t ? t(item) : item).join(' ');
    }
    return t ? t(value) : value;
  };
};
export const createStyleGetter = config => {
  const setValue = createStyleValueSetter(config);
  return (value, name, prop = config.prop) => {
    if (typeof value === 'undefined' || !name) {
      return;
    }
    return {
      [`--rs-${name}-${prop}`]: setValue(value, name, prop)
    };
  };
};