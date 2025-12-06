'use client';
import { useState } from 'react';
import { useEventCallback } from "../../internals/hooks/index.js";
import { getSafeRegExpString } from "../../internals/utils/index.js";
function useSearch(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const {
    labelKey,
    valueKey,
    flattenedData,
    uncheckableItemValues,
    onSearch
  } = props;
  const getSearchResult = () => {
    const items = [];
    const result = flattenedData.filter(item => {
      if (uncheckableItemValues !== null && uncheckableItemValues !== void 0 && uncheckableItemValues.some(value => item[valueKey] === value)) {
        return false;
      }
      if (item[labelKey].match(new RegExp(getSafeRegExpString(searchKeyword), 'i'))) {
        return true;
      }
      return false;
    });
    for (let i = 0; i < result.length; i++) {
      items.push(result[i]);

      // A maximum of 100 search results are returned.
      if (i === 99) {
        return items;
      }
    }
    return items;
  };
  const handleSearch = useEventCallback((value, event) => {
    setSearchKeyword(value);
    onSearch === null || onSearch === void 0 || onSearch(value, event);
  });
  return {
    searchKeyword,
    setSearchKeyword,
    items: getSearchResult(),
    handleSearch
  };
}
export default useSearch;