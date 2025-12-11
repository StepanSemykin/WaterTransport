'use client';
import { useState } from 'react';
import { useEventCallback } from "../../internals/hooks/index.js";
import { getSafeRegExpString } from "../../internals/utils/index.js";
function useSearch(props) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const {
    labelKey,
    childrenKey,
    parentMap,
    flattenedData,
    parentSelectable,
    onSearch
  } = props;
  const someKeyword = (item, keyword) => {
    if (item[labelKey].match(new RegExp(getSafeRegExpString(keyword || searchKeyword), 'i'))) {
      return true;
    }
    const parent = parentMap.get(item);
    if (parent && someKeyword(parent)) {
      return true;
    }
    return false;
  };
  const getSearchResult = keyword => {
    const items = [];
    const result = flattenedData.filter(item => {
      if (!parentSelectable && item[childrenKey]) {
        return false;
      }
      return someKeyword(item, keyword);
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
    const items = getSearchResult(value);
    setSearchKeyword(value);
    onSearch === null || onSearch === void 0 || onSearch(value, items, event);
  });
  return {
    searchKeyword,
    setSearchKeyword,
    items: getSearchResult(),
    handleSearch
  };
}
export default useSearch;