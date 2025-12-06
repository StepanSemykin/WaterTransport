'use client';
import { useState, useCallback, useEffect } from 'react';
import isArray from 'lodash/isArray';
import { shouldDisplay } from "../../internals/Picker/index.js";
import { useItemDataKeys } from "../../internals/Tree/TreeProvider.js";
/**
 * Custom hook for searching and filtering data in a tree structure.
 */
export default function useTreeSearch(props) {
  const {
    labelKey,
    childrenKey
  } = useItemDataKeys();
  const {
    searchKeyword,
    data,
    searchBy,
    callback
  } = props;
  const filterVisibleData = useCallback((data, searchKeyword) => {
    const setVisible = nodes => nodes.forEach(item => {
      item.visible = searchBy ? searchBy(searchKeyword, item[labelKey], item) : shouldDisplay(item[labelKey], searchKeyword);
      if (isArray(item[childrenKey])) {
        filterVisibleData(item[childrenKey], searchKeyword);
        item[childrenKey].forEach(child => {
          if (child.visible) {
            item.visible = child.visible;
          }
        });
      }
    });
    setVisible(data);
    return data;
  }, [childrenKey, labelKey, searchBy]);

  // Use search keywords to filter options.
  const [keyword, setSearchKeyword] = useState(searchKeyword !== null && searchKeyword !== void 0 ? searchKeyword : '');
  const [filteredData, setFilteredData] = useState(() => filterVisibleData(data, keyword));
  const handleSearch = (searchKeyword, event) => {
    const filteredData = filterVisibleData(data, searchKeyword);
    setFilteredData(filteredData);
    setSearchKeyword(searchKeyword);
    if (event) {
      callback === null || callback === void 0 || callback(searchKeyword, filteredData, event);
    }
  };
  useEffect(() => {
    handleSearch(searchKeyword !== null && searchKeyword !== void 0 ? searchKeyword : '');
  }, [searchKeyword]);
  useEffect(() => {
    setSearchKeyword(searchKeyword !== null && searchKeyword !== void 0 ? searchKeyword : '');
  }, [searchKeyword, setSearchKeyword]);
  const setVisibleData = useCallback((data, searchKeyword) => {
    setFilteredData(filterVisibleData(data, searchKeyword));
  }, [filterVisibleData]);
  return {
    keyword,
    filteredData,
    setFilteredData: setVisibleData,
    setSearchKeyword,
    handleSearch
  };
}