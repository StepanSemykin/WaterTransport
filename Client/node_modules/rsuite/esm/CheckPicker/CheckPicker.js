'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState } from 'react';
import clone from 'lodash/clone';
import isFunction from 'lodash/isFunction';
import remove from 'lodash/remove';
import pick from 'lodash/pick';
import isNil from 'lodash/isNil';
import SearchBox from "../internals/SearchBox/index.js";
import { filterNodesOfTree } from "../internals/Tree/utils/index.js";
import { useStyles, useControlled, useCustom, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, createChainedFunction, shallowEqual, mergeRefs, getDataGroupBy } from "../internals/utils/index.js";
import { Listbox, ListCheckItem, PickerToggle, PickerPopup, SelectedElement, PickerToggleTrigger, useFocusItemValue, useSearch, useToggleKeyDownEvent, usePickerRef, triggerPropKeys } from "../internals/Picker/index.js";
const emptyArray = [];
/**
 * A component for selecting checkable items in a dropdown list.
 * @see https://rsuitejs.com/components/check-picker
 */
const CheckPicker = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('CheckPicker', props);
  const {
    appearance = 'default',
    as,
    block,
    className,
    cleanable = true,
    classPrefix = 'picker',
    countable = true,
    data = emptyArray,
    defaultValue,
    disabled,
    disabledItemValues = emptyArray,
    groupBy,
    id,
    labelKey = 'label',
    listProps,
    listboxMaxHeight = 320,
    locale,
    placeholder,
    placement = 'bottomStart',
    popupAutoWidth = true,
    popupClassName,
    popupStyle,
    searchable = true,
    sticky,
    style,
    size,
    toggleAs,
    value: valueProp,
    valueKey = 'value',
    virtualized,
    sort,
    searchBy,
    renderOption,
    renderOptionGroup,
    renderListbox,
    renderValue,
    renderExtraFooter,
    onGroupTitleClick,
    onSearch,
    onEnter,
    onExit,
    onClean,
    onChange,
    onSelect,
    ...rest
  } = propsWithDefaults;
  const {
    trigger,
    root,
    target,
    overlay,
    list,
    searchInput
  } = usePickerRef(ref);
  const [value, setValue] = useControlled(valueProp, defaultValue || []);

  // Used to hover the focuse item  when trigger `onKeydown`
  const {
    focusItemValue,
    setFocusItemValue,
    onKeyDown: onFocusItem
  } = useFocusItemValue(value === null || value === void 0 ? void 0 : value[0], {
    data,
    valueKey,
    target: () => overlay.current
  });
  const handleSearchCallback = useEventCallback((searchKeyword, filteredData, event) => {
    var _filteredData$;
    // The first option after filtering is the focus.
    setFocusItemValue(filteredData === null || filteredData === void 0 || (_filteredData$ = filteredData[0]) === null || _filteredData$ === void 0 ? void 0 : _filteredData$[valueKey]);
    onSearch === null || onSearch === void 0 || onSearch(searchKeyword, event);
  });

  // Use search keywords to filter options.
  const {
    searchKeyword,
    filteredData,
    handleSearch,
    resetSearch,
    checkShouldDisplay
  } = useSearch(data, {
    labelKey,
    searchBy,
    callback: handleSearchCallback
  });

  // Use component active state to support keyboard events.
  const [active, setActive] = useState(false);

  // A list of shortcut options.
  // when opened again, the selected options are displayed at the top.
  const [stickyItems, setStickyItems] = useState([]);
  const initStickyItems = () => {
    if (!sticky) {
      return;
    }
    let nextStickyItems = [];
    if (data && value.length) {
      nextStickyItems = data.filter(item => {
        return value.some(v => v === item[valueKey]);
      });
    }
    setStickyItems(nextStickyItems);
  };
  const handleChangeValue = useEventCallback((value, event) => {
    onChange === null || onChange === void 0 || onChange(value, event);
  });
  const handleClean = useEventCallback(event => {
    if (disabled || !cleanable) {
      return;
    }
    setValue([]);
    onClean === null || onClean === void 0 || onClean(event);
    handleChangeValue([], event);
  });
  const handleMenuPressEnter = event => {
    const nextValue = clone(value);
    if (!focusItemValue) {
      return;
    }
    if (!nextValue.some(v => shallowEqual(v, focusItemValue))) {
      nextValue.push(focusItemValue);
    } else {
      remove(nextValue, itemVal => shallowEqual(itemVal, focusItemValue));
    }
    const focusItem = data.find(item => shallowEqual(item === null || item === void 0 ? void 0 : item[valueKey], focusItemValue));
    setValue(nextValue);
    handleSelect(nextValue, focusItem, event);
    handleChangeValue(nextValue, event);
  };
  const onPickerKeyDown = useToggleKeyDownEvent({
    toggle: !focusItemValue || !active,
    trigger,
    target,
    overlay,
    searchInput,
    active,
    onExit: handleClean,
    onMenuKeyDown: onFocusItem,
    onMenuPressEnter: handleMenuPressEnter,
    onMenuPressBackspace: handleClean,
    ...rest
  });
  const handleSelect = useEventCallback((nextItemValue, item, event) => {
    onSelect === null || onSelect === void 0 || onSelect(nextItemValue, item, event);
  });
  const handleItemSelect = useEventCallback((nextItemValue, item, event, checked) => {
    const nextValue = clone(value);
    if (checked) {
      nextValue.push(nextItemValue);
    } else {
      remove(nextValue, itemVal => shallowEqual(itemVal, nextItemValue));
    }
    setValue(nextValue);
    setFocusItemValue(nextItemValue);
    handleSelect(nextValue, item, event);
    handleChangeValue(nextValue, event);
  });
  const handleEnter = useEventCallback(() => {
    setActive(true);
  });
  const handleExit = useEventCallback(() => {
    resetSearch();
    setFocusItemValue(null);
    setActive(false);
  });
  const selectedItems = data.filter(item => value === null || value === void 0 ? void 0 : value.some(val => shallowEqual(item[valueKey], val))) || [];

  /**
   * 1.Have a value and the value is valid.
   * 2.Regardless of whether the value is valid, as long as renderValue is set, it is judged to have a value.
   */
  let hasValue = selectedItems.length > 0 || (value === null || value === void 0 ? void 0 : value.length) > 0 && isFunction(renderValue);
  const {
    prefix,
    merge
  } = useStyles(classPrefix);
  let selectedElement = placeholder;
  if (selectedItems.length > 0) {
    selectedElement = /*#__PURE__*/React.createElement(SelectedElement, {
      selectedItems: selectedItems,
      countable: countable,
      valueKey: valueKey,
      labelKey: labelKey,
      prefix: prefix,
      badgeSize: size
    });
  }
  if ((value === null || value === void 0 ? void 0 : value.length) > 0 && isFunction(renderValue)) {
    selectedElement = renderValue(value, selectedItems, selectedElement);
    // If renderValue returns null or undefined, hasValue is false.
    if (isNil(selectedElement)) {
      hasValue = false;
    }
  }
  const renderPopup = (positionProps, speakerRef) => {
    const {
      className
    } = positionProps;
    const classes = merge(className, popupClassName, prefix('check-menu'));
    let items = filteredData;
    let filteredStickyItems = [];
    if (stickyItems) {
      filteredStickyItems = filterNodesOfTree(stickyItems, item => checkShouldDisplay(item));
      items = filterNodesOfTree(data, item => {
        return checkShouldDisplay(item) && !stickyItems.some(v => v[valueKey] === item[valueKey]);
      });
    }

    // Create a tree structure data when set `groupBy`
    if (groupBy) {
      items = getDataGroupBy(items, groupBy, sort);
    } else if (typeof sort === 'function') {
      items = items.sort(sort(false));
    }
    const listbox = items.length || filteredStickyItems.length ? /*#__PURE__*/React.createElement(Listbox, {
      listProps: listProps,
      listRef: list,
      disabledItemValues: disabledItemValues,
      valueKey: valueKey,
      labelKey: labelKey,
      renderOptionGroup: renderOptionGroup,
      renderOption: renderOption,
      maxHeight: listboxMaxHeight,
      classPrefix: 'picker-check-menu',
      listItemAs: ListCheckItem,
      activeItemValues: value,
      focusItemValue: focusItemValue,
      data: [...filteredStickyItems, ...items],
      groupBy: groupBy,
      onSelect: handleItemSelect,
      onGroupTitleClick: onGroupTitleClick,
      virtualized: virtualized,
      query: searchKeyword
    }) : /*#__PURE__*/React.createElement("div", {
      className: prefix`none`
    }, locale === null || locale === void 0 ? void 0 : locale.noResultsText);
    return /*#__PURE__*/React.createElement(PickerPopup, {
      ref: mergeRefs(overlay, speakerRef),
      autoWidth: popupAutoWidth,
      className: classes,
      style: popupStyle,
      onKeyDown: onPickerKeyDown,
      target: trigger
    }, searchable && /*#__PURE__*/React.createElement(SearchBox, {
      placeholder: locale === null || locale === void 0 ? void 0 : locale.searchPlaceholder,
      onChange: handleSearch,
      value: searchKeyword,
      inputRef: searchInput
    }), renderListbox ? renderListbox(listbox) : listbox, renderExtraFooter === null || renderExtraFooter === void 0 ? void 0 : renderExtraFooter());
  };
  const triggerProps = {
    ...pick(props, triggerPropKeys),
    onEnter: createChainedFunction(initStickyItems, handleEnter, onEnter),
    onExit: createChainedFunction(handleExit, onExit)
  };
  return /*#__PURE__*/React.createElement(PickerToggleTrigger, {
    as: as,
    id: id,
    multiple: true,
    pickerType: "check",
    block: block,
    disabled: disabled,
    appearance: appearance,
    triggerProps: triggerProps,
    ref: trigger,
    placement: placement,
    speaker: renderPopup,
    rootRef: root,
    style: style,
    classPrefix: classPrefix,
    className: className
  }, /*#__PURE__*/React.createElement(PickerToggle, _extends({
    ref: target,
    appearance: appearance,
    disabled: disabled,
    onClean: handleClean,
    onKeyDown: onPickerKeyDown,
    as: toggleAs,
    cleanable: cleanable && !disabled,
    countable: countable,
    hasValue: hasValue,
    active: active,
    placement: placement,
    inputValue: value,
    focusItemValue: focusItemValue,
    size: size
  }, rest), selectedElement || (locale === null || locale === void 0 ? void 0 : locale.placeholder)));
});
CheckPicker.displayName = 'CheckPicker';
export default CheckPicker;