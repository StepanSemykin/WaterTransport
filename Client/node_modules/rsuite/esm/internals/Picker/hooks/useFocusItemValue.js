'use client';
import { useState } from 'react';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import find from 'lodash/find';
import { getHeight } from 'dom-lib';
import { useEventCallback } from "../../hooks/index.js";
import { shallowEqual } from "../../utils/index.js";
import { findNodeOfTree } from "../../Tree/utils/index.js";
import { onMenuKeyDown } from "../utils.js";
/**
 * A hook that manages the focus state of the option.
 * @param defaultFocusItemValue
 * @param props
 */
const useFocusItemValue = (defaultFocusItemValue, props) => {
  const {
    valueKey = 'value',
    focusableQueryKey = '[data-key][aria-disabled="false"]',
    defaultLayer = 0,
    focusToOption = true,
    data,
    target,
    rtl,
    callback,
    // TODO-Doma This legacy behavior of using `.parent` property should be deprecated
    //           Always explicitly pass `getParent` when there's need to traverse upwards
    getParent = item => item === null || item === void 0 ? void 0 : item.parent
  } = props;
  const [focusItemValue, setFocusItemValue] = useState(defaultFocusItemValue);
  const [layer, setLayer] = useState(defaultLayer);
  const [keys, setKeys] = useState([]);
  const focusCallback = useEventCallback((value, event) => {
    if (focusToOption) {
      const menu = isFunction(target) ? target() : target;
      const focusElement = menu === null || menu === void 0 ? void 0 : menu.querySelector(`[data-key="${value}"]`);
      focusElement === null || focusElement === void 0 || focusElement.focus();
    }
    callback === null || callback === void 0 || callback(value, event);
  });
  const getScrollContainer = useEventCallback(() => {
    const menu = isFunction(target) ? target() : target;

    // For Cascader and MutiCascader
    const subMenu = menu === null || menu === void 0 ? void 0 : menu.querySelector(`[data-layer="${layer}"]`);
    if (subMenu) {
      return subMenu;
    }

    // For SelectPicker、CheckPicker、Autocomplete、InputPicker、TagPicker
    return menu === null || menu === void 0 ? void 0 : menu.querySelector('[role="listbox"]');
  });

  /**
   * Get the elements visible in all options.
   */
  const getFocusableMenuItems = () => {
    if (!target) {
      return [];
    }
    let currentKeys = keys;
    if (layer < 1) {
      const popup = isFunction(target) ? target() : target;
      const rootMenu = popup === null || popup === void 0 ? void 0 : popup.querySelector('[data-layer="0"]');
      if (rootMenu) {
        var _rootMenu$querySelect;
        currentKeys = Array.from((_rootMenu$querySelect = rootMenu.querySelectorAll(focusableQueryKey)) !== null && _rootMenu$querySelect !== void 0 ? _rootMenu$querySelect : []).map(item => {
          var _item$dataset;
          return (_item$dataset = item.dataset) === null || _item$dataset === void 0 ? void 0 : _item$dataset.key;
        });
      } else {
        var _popup$querySelectorA;
        currentKeys = Array.from((_popup$querySelectorA = popup === null || popup === void 0 ? void 0 : popup.querySelectorAll(focusableQueryKey)) !== null && _popup$querySelectorA !== void 0 ? _popup$querySelectorA : []).map(item => {
          var _item$dataset2;
          return (_item$dataset2 = item.dataset) === null || _item$dataset2 === void 0 ? void 0 : _item$dataset2.key;
        });
      }
    }

    // 1. It is necessary to traverse the `keys` instead of `data` here to preserve the order of the array.
    // 2. The values in `keys` are all string, so the corresponding value of `data` should also be converted to string
    return currentKeys.map(key => find(data, i => `${i[valueKey]}` === key));
  };

  /**
   * Get the index of the focus item.
   */
  const findFocusItemIndex = useEventCallback(callback => {
    const items = getFocusableMenuItems();
    for (let i = 0; i < items.length; i += 1) {
      var _items$i;
      if (shallowEqual(focusItemValue, (_items$i = items[i]) === null || _items$i === void 0 ? void 0 : _items$i[valueKey])) {
        callback(items, i);
        return;
      }
    }
    callback(items, -1);
  });
  const scrollListItem = useEventCallback((direction, itemValue, willOverflow) => {
    const container = getScrollContainer();
    const item = container === null || container === void 0 ? void 0 : container.querySelector(`[data-key="${itemValue}"]`);
    if (willOverflow && container) {
      const {
        scrollHeight,
        clientHeight
      } = container;
      container.scrollTop = direction === 'top' ? scrollHeight - clientHeight : 0;
      return;
    }
    if (item && container) {
      if (!isVisible(item, container, direction)) {
        const height = getHeight(item);
        scrollTo(container, direction, height);
      }
    }
  });
  const focusNextMenuItem = useEventCallback(event => {
    findFocusItemIndex((items, index) => {
      const willOverflow = index + 2 > items.length;
      const nextIndex = willOverflow ? 0 : index + 1;
      const focusItem = items[nextIndex];
      if (!isUndefined(focusItem)) {
        setFocusItemValue(focusItem[valueKey]);
        focusCallback(focusItem[valueKey], event);
        scrollListItem('bottom', focusItem[valueKey], willOverflow);
      }
    });
  });
  const focusPrevMenuItem = useEventCallback(event => {
    findFocusItemIndex((items, index) => {
      const willOverflow = index === 0;
      const nextIndex = willOverflow ? items.length - 1 : index - 1;
      const focusItem = items[nextIndex];
      if (!isUndefined(focusItem)) {
        setFocusItemValue(focusItem[valueKey]);
        focusCallback(focusItem[valueKey], event);
        scrollListItem('top', focusItem[valueKey], willOverflow);
      }
    });
  });
  const getSubMenuKeys = nextLayer => {
    const menu = isFunction(target) ? target() : target;
    const subMenu = menu === null || menu === void 0 ? void 0 : menu.querySelector(`[data-layer="${nextLayer}"]`);
    if (subMenu) {
      var _Array$from;
      return (_Array$from = Array.from(subMenu.querySelectorAll(focusableQueryKey))) === null || _Array$from === void 0 ? void 0 : _Array$from.map(item => {
        var _item$dataset3;
        return (_item$dataset3 = item.dataset) === null || _item$dataset3 === void 0 ? void 0 : _item$dataset3.key;
      });
    }
    return null;
  };
  const focusNextLevelMenu = useEventCallback(event => {
    const nextLayer = layer + 1;
    const nextKeys = getSubMenuKeys(nextLayer);
    if (nextKeys) {
      setKeys(nextKeys);
      setLayer(nextLayer);
      setFocusItemValue(nextKeys[0]);
      focusCallback(nextKeys[0], event);
    }
  });
  const focusPrevLevelMenu = useEventCallback(event => {
    const nextLayer = layer - 1;
    const nextKeys = getSubMenuKeys(nextLayer);
    if (nextKeys) {
      var _getParent;
      setKeys(nextKeys);
      setLayer(nextLayer);
      const focusItem = findNodeOfTree(data, item => item[valueKey] === focusItemValue);
      const parentItemValue = (_getParent = getParent(focusItem)) === null || _getParent === void 0 ? void 0 : _getParent[valueKey];
      if (parentItemValue) {
        setFocusItemValue(parentItemValue);
        focusCallback(parentItemValue, event);
      }
    }
  });
  const handleKeyDown = useEventCallback(event => {
    onMenuKeyDown(event, {
      down: focusNextMenuItem,
      up: focusPrevMenuItem,
      [rtl ? 'left' : 'right']: focusNextLevelMenu,
      [rtl ? 'right' : 'left']: focusPrevLevelMenu
    });
  });
  return {
    focusItemValue,
    setFocusItemValue,
    layer,
    setLayer,
    keys,
    setKeys,
    onKeyDown: handleKeyDown
  };
};
function scrollTo(container, direction, step) {
  const {
    scrollTop
  } = container;
  container.scrollTop = direction === 'top' ? scrollTop - step : scrollTop + step;
}

/**
 * Checks if the element has a vertical scrollbar.
 */
function hasVerticalScroll(element) {
  const {
    scrollHeight,
    clientHeight
  } = element;
  return scrollHeight > clientHeight;
}

/**
 * Checks if the element is within the visible area of the container
 */
function isVisible(element, container, direction) {
  if (!hasVerticalScroll(container)) {
    return true;
  }
  const {
    top,
    bottom,
    height
  } = element.getBoundingClientRect();
  const {
    top: containerTop,
    bottom: containerBottom
  } = container.getBoundingClientRect();
  if (direction === 'top') {
    return top + height > containerTop;
  }
  return bottom - height < containerBottom;
}
export default useFocusItemValue;