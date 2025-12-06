'use client';
import { useState, useCallback, useMemo } from 'react';
import isUndefined from 'lodash/isUndefined';
import { shouldDisplay } from "../utils.js";
/**
 * A hook that handles search filter options
 */
function useSearch(data, props) {
  const {
    labelKey,
    searchBy,
    callback
  } = props;

  // Use search keywords to filter options.
  const [searchKeyword, setSearchKeyword] = useState('');
  const resetSearch = useCallback(() => {
    setSearchKeyword('');
  }, []);

  /**
   * Index of keyword  in `label`
   * @param {node} label
   */
  const checkShouldDisplay = useCallback((item, keyword) => {
    const checkValue = typeof item === 'object' ? item === null || item === void 0 ? void 0 : item[labelKey] : String(item);
    const _keyword = isUndefined(keyword) ? searchKeyword : keyword;
    if (typeof searchBy === 'function') {
      return searchBy(_keyword, checkValue, item);
    }
    return shouldDisplay(checkValue, _keyword);
  }, [labelKey, searchBy, searchKeyword]);
  const filteredData = useMemo(() => {
    return data.filter(item => checkShouldDisplay(item, searchKeyword));
  }, [checkShouldDisplay, data, searchKeyword]);
  const handleSearch = (searchKeyword, event) => {
    const filteredData = data.filter(item => checkShouldDisplay(item, searchKeyword));
    setSearchKeyword(searchKeyword);
    callback === null || callback === void 0 || callback(searchKeyword, filteredData, event);
  };
  return {
    searchKeyword,
    filteredData,
    checkShouldDisplay,
    handleSearch,
    resetSearch
  };
}
export default useSearch;