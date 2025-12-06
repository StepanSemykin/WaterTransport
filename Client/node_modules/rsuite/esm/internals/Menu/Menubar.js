'use client';
// Headless ARIA `menubar`
import React, { useCallback, useRef } from 'react';
import isNil from 'lodash/isNil';
import useMenu from "./useMenu.js";
import MenuContext, { MenuActionTypes, MoveFocusTo } from "./MenuContext.js";
import { KEY_VALUES } from "../constants/index.js";
import { useCustom } from "../hooks/index.js";
import { isFocusEntering, isFocusLeaving, isFocusableElement } from "../utils/index.js";
/**
 * @private
 */
export default function Menubar({
  vertical = false,
  children,
  onActivateItem
}) {
  var _items$activeItemInde3;
  const menubar = useMenu({
    role: 'menubar'
  });
  const [{
    items,
    activeItemIndex
  }, dispatch] = menubar;
  const menubarElementRef = useRef(null);
  const onFocus = useCallback(event => {
    // Focus moves inside Menubar
    if (isFocusEntering(event) &&
    // Skip if focus is moving to a focusable element within this menu
    !(event.target !== event.currentTarget && isFocusableElement(event.target))) {
      const disabled = event.target.getAttribute('aria-disabled');

      // Skip if the item is disabled
      if (activeItemIndex === null && disabled !== 'true') {
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.First
        });
      }
    }
  }, [activeItemIndex, dispatch]);
  const onBlur = useCallback(event => {
    // Focus moves outside of Menubar
    if (isFocusLeaving(event)) {
      dispatch({
        type: MenuActionTypes.MoveFocus,
        to: MoveFocusTo.None
      });
    }
  }, [dispatch]);
  const {
    rtl
  } = useCustom();
  const onKeyDown = useCallback(event => {
    var _items$activeItemInde, _items$activeItemInde2;
    const activeItemElement = isNil(activeItemIndex) ? null : (_items$activeItemInde = (_items$activeItemInde2 = items[activeItemIndex]) === null || _items$activeItemInde2 === void 0 ? void 0 : _items$activeItemInde2.element) !== null && _items$activeItemInde !== void 0 ? _items$activeItemInde : null;
    switch (true) {
      case !vertical && !rtl && event.key === KEY_VALUES.RIGHT:
      case !vertical && rtl && event.key === KEY_VALUES.LEFT:
      case vertical && event.key === KEY_VALUES.DOWN:
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.Next
        });
        break;
      case !vertical && !rtl && event.key === KEY_VALUES.LEFT:
      case !vertical && rtl && event.key === KEY_VALUES.RIGHT:
      case vertical && event.key === KEY_VALUES.UP:
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.Prev
        });
        break;
      case event.key === KEY_VALUES.HOME:
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.First
        });
        break;
      case event.key === KEY_VALUES.END:
        event.preventDefault();
        event.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.Last
        });
        break;
      case !vertical && event.key === KEY_VALUES.DOWN:
      case vertical && !rtl && event.key === KEY_VALUES.RIGHT:
      case vertical && rtl && event.key === KEY_VALUES.LEFT:
        if ((activeItemElement === null || activeItemElement === void 0 ? void 0 : activeItemElement.getAttribute('aria-haspopup')) === 'menu') {
          event.preventDefault();
          event.stopPropagation();
          activeItemElement.click();
        }
        break;
      case event.key === KEY_VALUES.ENTER:
      case event.key === KEY_VALUES.SPACE:
        event.preventDefault();
        event.stopPropagation();
        activeItemElement === null || activeItemElement === void 0 || activeItemElement.click();
        break;
    }
  }, [rtl, items, activeItemIndex, dispatch, vertical]);

  // Only used for handling click events bubbling from children
  // Which indicates that a child menuitem is being activated
  const onClick = useCallback(event => {
    if (items.some(item => item.element === event.target)) {
      onActivateItem === null || onActivateItem === void 0 || onActivateItem(event);
    }
  }, [items, onActivateItem]);
  return /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: menubar
  }, children({
    role: 'menubar',
    tabIndex: 0,
    onFocus,
    onBlur,
    onKeyDown,
    onClick,
    'aria-activedescendant': isNil(activeItemIndex) ? undefined : (_items$activeItemInde3 = items[activeItemIndex]) === null || _items$activeItemInde3 === void 0 ? void 0 : _items$activeItemInde3.element.id,
    'aria-orientation': vertical ? 'vertical' : undefined // implicitly set 'horizontal'
  }, menubarElementRef));
}