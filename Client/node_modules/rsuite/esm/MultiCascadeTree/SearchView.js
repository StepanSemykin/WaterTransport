'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React from 'react';
import SearchBox from "../internals/SearchBox/index.js";
import Checkbox from "../Checkbox/index.js";
import Highlight from "../Highlight/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { isSomeChildChecked, getNodeParents } from "./utils.js";
function SearchView(props) {
  const {
    as: Component = 'div',
    classPrefix = 'cascade-search-view',
    className,
    searchKeyword,
    childrenKey,
    labelKey,
    valueKey,
    value,
    data,
    disabledItemValues,
    inputRef,
    cascade,
    locale: overrideLocale,
    onSearch,
    onCheck,
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
    const nodes = getNodeParents(item);
    const label = /*#__PURE__*/React.createElement(Highlight, {
      as: "span",
      query: searchKeyword
    }, item[labelKey]);
    nodes.push({
      ...item,
      [labelKey]: label
    });
    const active = value.some(value => {
      if (cascade) {
        return nodes.some(node => node[valueKey] === value);
      }
      return item[valueKey] === value;
    });
    const disabled = disabledItemValues.some(value => nodes.some(node => node[valueKey] === value));
    const rowClasses = prefix('row', {
      'row-disabled': disabled
    });
    const indeterminate = cascade && !active && isSomeChildChecked(item, value, {
      valueKey,
      childrenKey
    });
    const handleChange = (_value, checked, event) => {
      onCheck === null || onCheck === void 0 || onCheck(item, event, checked);
    };
    return /*#__PURE__*/React.createElement("div", {
      role: "treeitem",
      "aria-disabled": disabled,
      key: key,
      className: rowClasses,
      "data-key": item[valueKey]
    }, /*#__PURE__*/React.createElement(Checkbox, {
      disabled: disabled,
      checked: active,
      value: item[valueKey],
      indeterminate: indeterminate,
      onChange: handleChange
    }, /*#__PURE__*/React.createElement("span", {
      className: prefix('col-group')
    }, nodes.map((node, index) => /*#__PURE__*/React.createElement("span", {
      key: `col-${index}`,
      className: prefix('col')
    }, node[labelKey])))));
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