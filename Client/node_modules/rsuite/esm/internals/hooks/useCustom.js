'use client';
import assign from 'lodash/assign';
import enGB from "../../locales/en_GB.js";
import { useContext, useCallback, useMemo } from 'react';
import { format, parse, isValid } from "../utils/date/index.js";
import { CustomContext } from "../Provider/CustomContext.js";
function getDefaultRTL() {
  return typeof document !== 'undefined' && (document.body.getAttribute('dir') || document.dir) === 'rtl';
}

/**
 * Maps a component name to its corresponding locale key
 * @param componentName - The name of the component
 * @returns The locale key for the component
 */
function getComponentLocaleKey(componentName) {
  // Define mappings for components that share locale keys
  const localeKeyMappings = {
    // All picker components use the Combobox locale
    Cascader: 'Combobox',
    CheckTreePicker: 'Combobox',
    MultiCascader: 'Combobox',
    SelectPicker: 'Combobox',
    TreePicker: 'Combobox',
    CheckPicker: 'Combobox',
    // Time components use date components locales
    TimePicker: 'DatePicker',
    TimeRangePicker: 'DateRangePicker'
  };

  // Return the mapped locale key or the component name itself if no mapping exists
  return localeKeyMappings[componentName] || componentName;
}

/**
 * A hook to get custom configuration of `<CustomProvider>`
 * @param componentName - The name of the component
 * @param componentProps - The props of the component
 */
export function useCustom(componentName, componentProps) {
  var _globalLocale$DateTim;
  const {
    components = {},
    locale: globalLocale = enGB,
    rtl = getDefaultRTL(),
    formatDate,
    parseDate,
    classPrefix,
    toasters,
    disableRipple
  } = useContext(CustomContext);
  const {
    locale: componentLocale,
    ...restProps
  } = componentProps || {};
  const dateLocale = globalLocale === null || globalLocale === void 0 || (_globalLocale$DateTim = globalLocale.DateTimeFormats) === null || _globalLocale$DateTim === void 0 ? void 0 : _globalLocale$DateTim.dateLocale;
  const code = globalLocale === null || globalLocale === void 0 ? void 0 : globalLocale.code;
  const getLocale = useCallback((key, overrideLocale) => {
    // Initialize with common locale
    const publicLocale = (globalLocale === null || globalLocale === void 0 ? void 0 : globalLocale.common) || {};

    // Merge component-specific locale(s) based on key type
    const specificLocale = typeof key === 'string' ? globalLocale === null || globalLocale === void 0 ? void 0 : globalLocale[key] : Array.isArray(key) ? assign({}, ...key.map(k => globalLocale === null || globalLocale === void 0 ? void 0 : globalLocale[k])) : {};

    // Merge all parts: public locale, specific locale, custom component locale
    return assign({}, publicLocale, specificLocale, componentLocale, overrideLocale);
  }, [globalLocale, componentLocale]);
  const propsWithDefaults = useMemo(() => {
    var _components$component;
    if (!componentName) {
      return;
    }

    //Memoize the global default props based on component name
    const globalDefaultProps = ((_components$component = components[componentName]) === null || _components$component === void 0 ? void 0 : _components$component.defaultProps) || {};
    const mergedProps = assign({}, globalDefaultProps, restProps);
    const localeKey = getComponentLocaleKey(componentName);

    // If the default locale has the component name, then merge the locale.
    if (Object.keys(enGB).includes(localeKey)) {
      return {
        ...mergedProps,
        locale: getLocale(localeKey)
      };
    }
    return mergedProps;
  }, [componentName, components, getLocale, restProps]);
  const _formatDate = useCallback((date, formatStr, options) => {
    try {
      if (formatDate) {
        return formatDate(date, formatStr, options);
      }
      return format(isValid(date) ? date : new Date(), formatStr, {
        locale: dateLocale,
        ...options
      });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error: Invalid date format', error);
      }
      return 'Error: Invalid date format';
    }
  }, [dateLocale, formatDate]);
  const _parseDate = useCallback((dateString, formatString, referenceDate, options) => {
    if (parseDate) {
      return parseDate(dateString, formatString, referenceDate, options);
    }
    return parse(dateString, formatString, referenceDate || new Date(), {
      locale: dateLocale,
      ...options
    });
  }, [parseDate, dateLocale]);
  return {
    code,
    rtl,
    toasters,
    disableRipple,
    classPrefix,
    propsWithDefaults,
    getLocale,
    formatDate: _formatDate,
    parseDate: _parseDate
  };
}
export default useCustom;