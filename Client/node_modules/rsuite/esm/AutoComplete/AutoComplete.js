'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useState } from 'react';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import Combobox from "./Combobox.js";
import Plaintext from "../internals/Plaintext/index.js";
import { useStyles, useCustom, useControlled, useIsMounted, useEventCallback } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, partitionHTMLProps } from "../internals/utils/index.js";
import { transformData, shouldDisplay } from "./utils.js";
import { PickerToggleTrigger, onMenuKeyDown, Listbox, ListItem, PickerPopup, useFocusItemValue, usePickerRef, triggerPropKeys } from "../internals/Picker/index.js";
/**
 * Autocomplete function of input field.
 * @see https://rsuitejs.com/components/auto-complete
 *
 * TODO: Remove unnecessary .rs-auto-complete element
 * TODO: role=combobox and aria-autocomplete on input element
 */
// Use type assertion to avoid type error with required properties
const AutoComplete = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('AutoComplete', props);
  const {
    as,
    disabled,
    className,
    placement = 'bottomStart',
    selectOnEnter = true,
    classPrefix = 'auto-complete',
    defaultValue = '',
    popupAutoWidth = true,
    popupClassName,
    popupStyle,
    data,
    value: valueProp,
    open,
    style,
    size,
    id,
    readOnly,
    plaintext,
    renderListbox,
    renderOption,
    onSelect,
    filterBy,
    onKeyDown,
    onChange,
    onClose,
    onOpen,
    onFocus,
    onBlur,
    onMenuFocus,
    ...rest
  } = propsWithDefaults;
  const datalist = transformData(data);
  const [value, setValue] = useControlled(valueProp, defaultValue);
  const [focus, setFocus] = useState(false);
  const items = (datalist === null || datalist === void 0 ? void 0 : datalist.filter(shouldDisplay(filterBy, value))) || [];
  const hasItems = items.length > 0;
  const {
    trigger,
    overlay,
    root
  } = usePickerRef(ref);
  const isMounted = useIsMounted();

  // Used to hover the focuse item  when trigger `onKeydown`
  const {
    focusItemValue,
    setFocusItemValue,
    onKeyDown: handleKeyDown
  } = useFocusItemValue(value, {
    data: datalist,
    focusToOption: false,
    callback: onMenuFocus,
    target: () => overlay.current
  });
  const handleKeyDownEvent = event => {
    if (!overlay.current) {
      return;
    }
    onMenuKeyDown(event, {
      enter: selectOnEnter ? selectFocusMenuItem : undefined,
      esc: handleClose
    });
    handleKeyDown(event);
    onKeyDown === null || onKeyDown === void 0 || onKeyDown(event);
  };
  const selectFocusMenuItem = event => {
    if (!focusItemValue) {
      return;
    }
    const focusItem = datalist.find(item => (item === null || item === void 0 ? void 0 : item.value) === focusItemValue);
    setValue(focusItemValue);
    setFocusItemValue(focusItemValue);
    handleSelect(focusItem, event);
    if (value !== focusItemValue) {
      handleChangeValue(focusItemValue, event);
    }
    handleClose();
  };
  const handleSelect = useEventCallback((item, event) => {
    onSelect === null || onSelect === void 0 || onSelect(item.value, item, event);
  });
  const handleChangeValue = useEventCallback((value, event) => {
    onChange === null || onChange === void 0 || onChange(value, event);
  });
  const handleChange = (value, event) => {
    setFocusItemValue('');
    setValue(value);
    setFocus(true);
    handleChangeValue(value, event);
  };
  const handleClose = useEventCallback(() => {
    if (isMounted()) {
      setFocus(false);
      onClose === null || onClose === void 0 || onClose();
    }
  });
  const handleOpen = useEventCallback(() => {
    setFocus(true);
    onOpen === null || onOpen === void 0 || onOpen();
  });
  const handleItemSelect = useEventCallback((nextItemValue, item, event) => {
    setValue(nextItemValue);
    setFocusItemValue(nextItemValue);
    handleSelect(item, event);
    if (value !== nextItemValue) {
      handleChangeValue(nextItemValue, event);
    }
    handleClose();
  });
  const handleInputFocus = useEventCallback(event => {
    onFocus === null || onFocus === void 0 || onFocus(event);
    handleOpen();
  });
  const handleInputBlur = useEventCallback(event => {
    setTimeout(handleClose, 300);
    onBlur === null || onBlur === void 0 || onBlur(event);
  });
  const {
    withPrefix,
    merge
  } = useStyles(classPrefix);
  const classes = merge(className, withPrefix({
    disabled
  }));
  const [htmlInputProps, restProps] = partitionHTMLProps(omit(rest, triggerPropKeys));
  const renderPopup = (positionProps, speakerRef) => {
    const {
      className
    } = positionProps;
    const classes = merge(className, popupClassName);
    const listbox = /*#__PURE__*/React.createElement(Listbox, {
      classPrefix: "auto-complete-menu",
      listItemClassPrefix: "auto-complete-item",
      listItemAs: ListItem,
      focusItemValue: focusItemValue,
      onSelect: handleItemSelect,
      renderOption: renderOption,
      data: items,
      query: value
    });
    return /*#__PURE__*/React.createElement(PickerPopup, {
      ref: mergeRefs(overlay, speakerRef),
      className: classes,
      onKeyDown: handleKeyDownEvent,
      target: trigger,
      style: popupStyle,
      autoWidth: popupAutoWidth
    }, renderListbox ? renderListbox(listbox) : listbox);
  };
  if (plaintext) {
    return /*#__PURE__*/React.createElement(Plaintext, {
      ref: ref,
      localeKey: "unfilled"
    }, typeof value === 'undefined' ? defaultValue : value);
  }
  const expanded = open || focus && hasItems;
  const triggerProps = {
    ...pick(props, triggerPropKeys),
    open: expanded
  };
  return /*#__PURE__*/React.createElement(PickerToggleTrigger, _extends({
    as: as,
    id: id,
    ref: trigger,
    placement: placement,
    triggerProps: triggerProps,
    trigger: ['click', 'focus'],
    speaker: renderPopup,
    className: classes,
    style: style,
    rootRef: root,
    responsive: false
  }, restProps), /*#__PURE__*/React.createElement(Combobox, _extends({}, htmlInputProps, {
    disabled: disabled,
    value: value,
    size: size,
    readOnly: readOnly,
    expanded: expanded,
    focusItemValue: focusItemValue,
    onBlur: handleInputBlur,
    onFocus: handleInputFocus,
    onChange: handleChange,
    onKeyDown: handleKeyDownEvent
  })));
});
AutoComplete.displayName = 'AutoComplete';
export default AutoComplete;