'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import SearchBox from "../internals/SearchBox/index.js";
import Highlight from "../Highlight/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { getPathTowardsItem } from "../internals/Tree/utils/index.js";
function SearchView(props) {
  const {
    as: Component = 'div',
    classPrefix = 'cascade-search-view',
    className,
    searchKeyword,
    labelKey,
    locale: overrideLocale,
    valueKey,
    parentMap,
    data,
    focusItemValue,
    disabledItemValues,
    inputRef,
    renderSearchItem,
    onSearch,
    onSelect,
    ...rest
  } = props;
  const {
    merge,
    prefix,
    withPrefix,
    rootPrefix
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix());
  const {
    getLocale
  } = useCustom();
  const {
    searchPlaceholder,
    noResultsText
  } = getLocale('Combobox', overrideLocale);
  const renderSearchRow = (item, key) => {
    const items = getPathTowardsItem(item, item => parentMap.get(item));
    const formattedNodes = items.map(itemData => {
      const label = /*#__PURE__*/React.createElement(Highlight, {
        as: "span",
        query: searchKeyword
      }, itemData[labelKey]);
      return {
        ...itemData,
        [labelKey]: label
      };
    });
    const disabled = disabledItemValues.some(value => formattedNodes.some(itemData => itemData[valueKey] === value));
    const itemClasses = prefix('row', {
      'row-disabled': disabled,
      'row-focus': item[valueKey] === focusItemValue
    });
    const label = formattedNodes.map((itemData, index) => /*#__PURE__*/React.createElement("span", {
      key: `col-${index}`,
      className: prefix('col')
    }, itemData[labelKey]));
    const handleCheck = event => {
      if (!disabled) {
        onSelect(item, items, event);
      }
    };
    return /*#__PURE__*/React.createElement("div", {
      role: "treeitem",
      "aria-disabled": disabled,
      "aria-label": item[labelKey],
      key: key,
      "data-key": item[valueKey],
      className: itemClasses,
      tabIndex: -1,
      onClick: handleCheck
    }, renderSearchItem ? renderSearchItem(label, items) : label);
  };
  return /*#__PURE__*/React.createElement(Component, _extends({
    className: classes
  }, rest), /*#__PURE__*/React.createElement(SearchBox, {
    placeholder: searchPlaceholder,
    onChange: onSearch,
    value: searchKeyword,
    inputRef: inputRef
  }), searchKeyword !== '' && /*#__PURE__*/React.createElement("div", {
    className: prefix('panel'),
    "data-layer": 0,
    role: "tree"
  }, data.length ? data.map(renderSearchRow) : /*#__PURE__*/React.createElement("div", {
    className: merge(prefix('none'), rootPrefix('picker-none'))
  }, noResultsText)));
}
export default SearchView;