'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useRef, useState, useEffect } from 'react';
import isUndefined from 'lodash/isUndefined';
import isString from 'lodash/isString';
import isNumber from 'lodash/isNumber';
import findIndex from 'lodash/findIndex';
import pickBy from 'lodash/pickBy';
import getPosition from 'dom-lib/getPosition';
import scrollTop from 'dom-lib/scrollTop';
import getHeight from 'dom-lib/getHeight';
import get from 'lodash/get';
import classNames from 'classnames';
import ListItemGroup from "./ListItemGroup.js";
import useCombobox from "./hooks/useCombobox.js";
import Highlight from "../../Highlight/index.js";
import { List, AutoSizer, VariableSizeList } from "../Windowing/index.js";
import { RSUITE_PICKER_GROUP_KEY } from "../symbols.js";
import { useStyles, useMount, useEventCallback } from "../hooks/index.js";
import { shallowEqual, mergeRefs, mergeStyles, getCssValue } from "../utils/index.js";
import { KEY_GROUP_TITLE } from "../utils/getDataGroupBy.js";

/**
 * Props for the Listbox component.
 */
/**
 * Props for the Listbox component.
 * @template Multiple - Whether multiple selection is enabled.
 */

const Listbox = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    data = [],
    groupBy,
    maxHeight = 320,
    activeItemValues = [],
    disabledItemValues = [],
    classPrefix = 'listbox',
    valueKey = 'value',
    labelKey = 'label',
    virtualized,
    listProps,
    listRef: virtualizedListRef,
    className,
    style,
    focusItemValue,
    listItemClassPrefix,
    listItemAs: ListItem,
    listItemProps,
    rowHeight = 36,
    rowGroupHeight = 48,
    query,
    renderOptionGroup,
    renderOption,
    onGroupTitleClick,
    onSelect,
    ...rest
  } = props;
  const {
    prefix,
    merge,
    rootPrefix
  } = useStyles(classPrefix);
  const groupable = typeof groupBy !== 'undefined';
  const classes = merge(className, rootPrefix('picker-listbox'), prefix('items', {
    grouped: groupable
  }));
  const {
    id,
    labelId,
    popupType,
    multiple
  } = useCombobox();
  const menuBodyContainerRef = useRef(null);
  const listRef = useRef(null);
  const [foldedGroupKeys, setFoldedGroupKeys] = useState([]);
  const handleGroupTitleClick = useEventCallback((key, event) => {
    const nextGroupKeys = foldedGroupKeys.filter(item => item !== key);
    if (nextGroupKeys.length === foldedGroupKeys.length) {
      nextGroupKeys.push(key);
    }
    setFoldedGroupKeys(nextGroupKeys);
    onGroupTitleClick === null || onGroupTitleClick === void 0 || onGroupTitleClick(event);
  });
  const handleSelect = useEventCallback((item, value, event, checked) => {
    onSelect === null || onSelect === void 0 || onSelect(value, item, event, checked);
  });
  const getRowHeight = (list, index) => {
    const item = list[index];
    if (groupable && item[RSUITE_PICKER_GROUP_KEY] && index !== 0) {
      return rowGroupHeight;
    }
    return rowHeight;
  };
  useEffect(() => {
    const container = menuBodyContainerRef.current;
    if (!container) {
      return;
    }
    let activeItem = container.querySelector(`.${prefix('item-focus')}`);
    if (!activeItem) {
      activeItem = container.querySelector(`.${prefix('item-active')}`);
    }
    if (!activeItem) {
      return;
    }
    const position = getPosition(activeItem, container);
    const sTop = scrollTop(container);
    const sHeight = getHeight(container);
    if (sTop > position.top) {
      scrollTop(container, Math.max(0, position.top - 20));
    } else if (position.top > sTop + sHeight) {
      scrollTop(container, Math.max(0, position.top - sHeight + 32));
    }
  }, [focusItemValue, menuBodyContainerRef, prefix]);
  const filteredItems = groupable ? data.filter(item => {
    var _item$parent;
    // Display group title items
    if (item[RSUITE_PICKER_GROUP_KEY]) return true;

    // Display items under the unfolded group
    const groupValue = get(item, groupBy, '') || (// FIXME-Doma
    // Usage of `item.parent` is strongly discouraged
    // It's only here for legacy support
    // Remove once `item.parent` is completely removed across related components
    (_item$parent = item.parent) === null || _item$parent === void 0 ? void 0 : _item$parent[KEY_GROUP_TITLE]);
    return !foldedGroupKeys.includes(groupValue);
  }) : data;
  const rowCount = filteredItems.length;
  const renderItem = ({
    index = 0,
    style,
    data,
    item: itemData
  }) => {
    const item = itemData || data[index];
    const value = item[valueKey];
    const itemLabel = item[labelKey];
    const label = query ? /*#__PURE__*/React.createElement(Highlight, {
      query: query,
      as: "span"
    }, itemLabel) : itemLabel;
    if (isUndefined(label) && !item[RSUITE_PICKER_GROUP_KEY]) {
      throw Error(`labelKey "${labelKey}" is not defined in "data" : ${index}`);
    }

    // Use `value` in keys when If `value` is string or number
    const itemKey = isString(value) || isNumber(value) ? value : index;

    //  Render <ListboxGroup> component when `groupBy` is defined
    if (groupable && item[RSUITE_PICKER_GROUP_KEY]) {
      const groupValue = item[KEY_GROUP_TITLE];
      return /*#__PURE__*/React.createElement(ListItemGroup, {
        style: style,
        classPrefix: 'picker-menu-group',
        className: classNames({
          folded: foldedGroupKeys.some(key => key === groupValue)
        }),
        key: `group-${groupValue}`,
        onClick: handleGroupTitleClick.bind(null, groupValue)
      }, renderOptionGroup ? renderOptionGroup(groupValue, item) : groupValue);
    } else if (isUndefined(value) && !isUndefined(item[RSUITE_PICKER_GROUP_KEY])) {
      throw Error(`valueKey "${valueKey}" is not defined in "data" : ${index} `);
    }
    const disabled = disabledItemValues === null || disabledItemValues === void 0 ? void 0 : disabledItemValues.some(disabledValue => shallowEqual(disabledValue, value));
    const active = activeItemValues === null || activeItemValues === void 0 ? void 0 : activeItemValues.some(v => shallowEqual(v, value));
    const focus = !isUndefined(focusItemValue) && shallowEqual(focusItemValue, value);
    return /*#__PURE__*/React.createElement(ListItem, _extends({
      "aria-posinset": index + 1,
      "aria-setsize": rowCount,
      style: style,
      key: itemKey,
      disabled: disabled,
      active: active,
      focus: focus,
      value: value,
      classPrefix: listItemClassPrefix,
      onSelect: handleSelect.bind(null, item)
    }, pickBy(listItemProps, v => v !== undefined)), renderOption ? renderOption(label, item) : label);
  };
  useMount(() => {
    var _listRef$current, _listRef$current$scro;
    const itemIndex = findIndex(filteredItems, item => item[valueKey] === (activeItemValues === null || activeItemValues === void 0 ? void 0 : activeItemValues[0]));
    (_listRef$current = listRef.current) === null || _listRef$current === void 0 || (_listRef$current$scro = _listRef$current.scrollToItem) === null || _listRef$current$scro === void 0 || _listRef$current$scro.call(_listRef$current, itemIndex);
  });
  const styles = mergeStyles(style, {
    '--rs-picker-listbox-max-height': getCssValue(maxHeight)
  });
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "listbox",
    id: `${id}-${popupType}`,
    "aria-labelledby": labelId,
    "aria-multiselectable": multiple,
    className: classes,
    ref: mergeRefs(menuBodyContainerRef, ref),
    style: styles
  }, rest), virtualized ? /*#__PURE__*/React.createElement(AutoSizer, {
    defaultHeight: maxHeight,
    style: {
      width: 'auto',
      height: 'auto'
    }
  }, ({
    height
  }) => /*#__PURE__*/React.createElement(List, _extends({
    as: VariableSizeList,
    ref: mergeRefs(listRef, virtualizedListRef),
    height: height || maxHeight,
    itemCount: rowCount,
    itemData: filteredItems,
    itemSize: getRowHeight.bind(this, filteredItems),
    className: rootPrefix('virt-list')
  }, listProps), renderItem)) : filteredItems.map((item, index) => renderItem({
    index,
    item
  })));
});
Listbox.displayName = 'Listbox';
export default Listbox;