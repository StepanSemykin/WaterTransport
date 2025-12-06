'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext, useRef, useMemo } from 'react';
import isNil from 'lodash/isNil';
import MenuContext, { MenuActionTypes, MoveFocusTo } from "./MenuContext.js";
import useMenu from "./useMenu.js";
import { useUniqueId, useFocus, useClickOutside } from "../hooks/index.js";
import { KEY_VALUES } from "../constants/index.js";
import { useCustom } from "../hooks/index.js";
import { isFocusLeaving, isFocusableElement } from "../utils/index.js";
const defaultOpenMenuOn = ['click'];
function getMenuItemTarget(event) {
  var _event$currentTarget;
  const target = event.target;
  if (target.getAttribute('role') === 'menuitem') {
    return target;
  }
  return Array.from((_event$currentTarget = event.currentTarget) === null || _event$currentTarget === void 0 ? void 0 : _event$currentTarget.querySelectorAll('[role="menuitem"]')).find(item => {
    return item.contains(target);
  });
}

/**
 * Headless ARIA `menu`
 * @private
 */
function Menu({
  disabled,
  children,
  openMenuOn = defaultOpenMenuOn,
  defaultOpen = false,
  open: openProp,
  menuButtonText,
  renderMenuButton,
  renderMenuPopup,
  onToggleMenu
}) {
  var _items$activeItemInde;
  const buttonElementRef = useRef(null);
  const menuElementRef = useRef(null);
  const parentMenu = useContext(MenuContext);
  const isSubmenu = !!parentMenu;
  const menu = useMenu({
    open: defaultOpen
  });
  const [{
    open: openState,
    items,
    activeItemIndex
  }, dispatch] = menu;
  const openControlled = typeof openProp !== 'undefined';
  const open = openControlled ? openProp : openState;
  const {
    rtl
  } = useCustom();
  const activeItem = isNil(activeItemIndex) ? null : (_items$activeItemInde = items[activeItemIndex]) === null || _items$activeItemInde === void 0 ? void 0 : _items$activeItemInde.element;
  const {
    grab: grabFocus
  } = useFocus(menuElementRef);
  const openMenu = useCallback(event => {
    dispatch({
      type: MenuActionTypes.OpenMenu
    });
    if (!event.isTrusted) {
      dispatch({
        type: MenuActionTypes.MoveFocus,
        to: MoveFocusTo.First
      });
    }
    onToggleMenu === null || onToggleMenu === void 0 || onToggleMenu(true, event);
    grabFocus();
  }, [dispatch, onToggleMenu, grabFocus]);
  const closeMenu = useCallback((event, returnFocusToButton = true) => {
    dispatch({
      type: MenuActionTypes.CloseMenu
    });
    dispatch({
      type: MenuActionTypes.MoveFocus,
      to: MoveFocusTo.None
    });
    onToggleMenu === null || onToggleMenu === void 0 || onToggleMenu(false, event);
    if (returnFocusToButton) {
      var _buttonElementRef$cur;
      (_buttonElementRef$cur = buttonElementRef.current) === null || _buttonElementRef$cur === void 0 || _buttonElementRef$cur.focus({
        preventScroll: true
      });
    }
  }, [dispatch, onToggleMenu, buttonElementRef]);
  const toggleMenu = useCallback(event => {
    if (!open) {
      openMenu(event);
    } else {
      closeMenu(event);
    }
  }, [open, openMenu, closeMenu]);
  useClickOutside({
    enabled: open,
    isOutside: event => {
      var _buttonElementRef$cur2, _menuElementRef$curre;
      return !((_buttonElementRef$cur2 = buttonElementRef.current) !== null && _buttonElementRef$cur2 !== void 0 && _buttonElementRef$cur2.contains(event.target)) && !((_menuElementRef$curre = menuElementRef.current) !== null && _menuElementRef$curre !== void 0 && _menuElementRef$curre.contains(event.target));
    },
    // fixme if clicking on a focusable element, don't move focus to menu button
    handle: event => closeMenu(event, !isFocusableElement(event.target))
  });

  /**
   * Keyboard interaction on menu button
   * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13
   */
  const handleButtonKeydown = useCallback(e => {
    switch (e.key) {
      // Open the menu
      case KEY_VALUES.ENTER:
      case KEY_VALUES.SPACE:
        e.preventDefault();
        e.stopPropagation();
        if (!open) {
          openMenu(e);
          dispatch({
            type: MenuActionTypes.MoveFocus,
            to: MoveFocusTo.First
          });
        } else {
          closeMenu(e);
        }
        break;
      // Open the menu (if closed) and move focus to first item
      // This is mostly useful after opening the menu with click
      case KEY_VALUES.DOWN:
        e.preventDefault();
        e.stopPropagation();
        if (!open) {
          openMenu(e);
        }
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.First
        });
        break;
    }
  }, [open, openMenu, closeMenu, dispatch]);
  const handleButtonClick = useCallback(event => {
    if (disabled) {
      return;
    }
    toggleMenu(event);
  }, [disabled, toggleMenu]);
  const handleButtonContextMenu = useCallback(event => {
    // prevents default contextmenu
    event.preventDefault();

    // Only opens menu on right click. Left click can close the menu opened by a right click
    if (open) return;
    if (disabled) return;
    openMenu(event);
  }, [open, disabled, openMenu]);
  const buttonEventHandlers = useMemo(() => {
    const buttonEventHandlers = {
      onKeyDown: handleButtonKeydown
    };

    /**
     * Bind event of trigger,
     * not used in  in the expanded state of '<Sidenav>'
     */
    if (openMenuOn !== null && openMenuOn !== void 0 && openMenuOn.includes('click')) {
      buttonEventHandlers.onClick = handleButtonClick;
    }
    if (openMenuOn !== null && openMenuOn !== void 0 && openMenuOn.includes('contextmenu')) {
      buttonEventHandlers.onContextMenu = handleButtonContextMenu;
    }
    return buttonEventHandlers;
  }, [openMenuOn, handleButtonKeydown, handleButtonClick, handleButtonContextMenu]);
  const buttonId = useUniqueId('menubutton-');
  const menuId = useUniqueId('menu-');
  const buttonAriaAttributes = useMemo(() => {
    // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#wai-aria-roles-states-and-properties-14
    return {
      role: 'button',
      'aria-haspopup': 'menu',
      'aria-expanded': open || undefined,
      // it's recommend to remove aria-expanded when menu is hidden
      'aria-controls': menuId
    };
  }, [open, menuId]);
  const buttonProps = useMemo(() => {
    return {
      id: buttonId,
      ...buttonAriaAttributes,
      ...buttonEventHandlers,
      // render props
      open
    };
  }, [buttonId, buttonAriaAttributes, buttonEventHandlers, open]);
  const customMenuButton = useMemo(() => {
    return renderMenuButton === null || renderMenuButton === void 0 ? void 0 : renderMenuButton(buttonProps, buttonElementRef);
  }, [renderMenuButton, buttonProps, buttonElementRef]);
  const buttonElement = customMenuButton !== null && customMenuButton !== void 0 ? customMenuButton : /*#__PURE__*/React.createElement("button", _extends({
    ref: buttonElementRef
  }, buttonProps), menuButtonText);

  /**
   * Keyboard interaction on menu
   * @see https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
   */
  const handleMenuKeydown = useCallback(e => {
    switch (e.key) {
      // Move focus to previous item
      case KEY_VALUES.UP:
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.Prev
        });
        break;
      // Move focus to next item
      case KEY_VALUES.DOWN:
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.Next
        });
        break;
      // When focus is in a menu and on a menuitem that has a submenu, opens the submenu and places focus on its first item.
      case KEY_VALUES.RIGHT:
        e.preventDefault();
        e.stopPropagation();
        if (!rtl) {
          if ((activeItem === null || activeItem === void 0 ? void 0 : activeItem.getAttribute('aria-haspopup')) === 'menu') {
            activeItem.click();
          }
        } else if (isSubmenu) {
          dispatch({
            type: MenuActionTypes.CloseMenu
          });
        }
        break;
      // When focus is in a submenu of an item in a menu, closes the submenu and returns focus to the parent menuitem.
      case KEY_VALUES.LEFT:
        e.preventDefault();
        e.stopPropagation();
        if (!rtl) {
          if (isSubmenu) {
            closeMenu(e);
          }
        } else if ((activeItem === null || activeItem === void 0 ? void 0 : activeItem.getAttribute('aria-haspopup')) === 'menu') {
          activeItem.click();
        }
        break;
      // Move focus to the first item
      case KEY_VALUES.HOME:
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.First
        });
        break;
      // Move focus to the last item
      case KEY_VALUES.END:
        e.preventDefault();
        e.stopPropagation();
        dispatch({
          type: MenuActionTypes.MoveFocus,
          to: MoveFocusTo.Last
        });
        break;
      // - When focus is on a menuitem that has a submenu, opens the submenu and places focus on its first item.
      // - Otherwise, activates the item and closes the menu.
      case KEY_VALUES.ENTER:
      case KEY_VALUES.SPACE:
        if (activeItem) {
          e.preventDefault();
          e.stopPropagation();
          activeItem.click();
          if (!activeItem.getAttribute('aria-haspopup')) {
            closeMenu(e);
          }
        }
        break;
      //  Close the menu that contains focus and return focus to the element or context,
      //  e.g., menu button or parent menuitem, from which the menu was opened.
      case KEY_VALUES.ESC:
        closeMenu(e);
        break;
    }
  }, [dispatch, activeItem, isSubmenu, rtl, closeMenu]);

  // Only used for clicks bubbling from child `menuitem`s.
  const handleMenuClick = useCallback(event => {
    const target = getMenuItemTarget(event);
    if (!target) return;

    // Only handle clicks on `menuitem`s
    if (target.getAttribute('role') !== 'menuitem') return;

    // Ignore clicks on `menuitem`s that controls a submenu
    if (target.getAttribute('aria-haspopup') === 'menu') return;

    // Ignore disabled `menuitem`s
    if (target.getAttribute('aria-disabled') === 'true') return;
    closeMenu(event, !isSubmenu);
  }, [closeMenu, isSubmenu]);

  // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#wai-aria-roles-states-and-properties-13
  const menuAriaAttributes = {
    role: 'menu',
    'aria-labelledby': buttonId,
    'aria-activedescendant': activeItem === null || activeItem === void 0 ? void 0 : activeItem.id
  };
  const menuEventHandlers = {
    onClick: handleMenuClick,
    onKeyDown: handleMenuKeydown
  };
  const menuProps = {
    id: menuId,
    ...menuAriaAttributes,
    ...menuEventHandlers,
    tabIndex: 0
  };
  const customMenuPopup = renderMenuPopup === null || renderMenuPopup === void 0 ? void 0 : renderMenuPopup({
    ...menuProps,
    open
  }, menuElementRef);

  // fixme Wrong children here
  const menuElement = customMenuPopup !== null && customMenuPopup !== void 0 ? customMenuPopup : /*#__PURE__*/React.createElement("ul", _extends({
    ref: menuElementRef
  }, menuProps, {
    hidden: !open
  }), children);
  const handleMouseEnter = useCallback(e => {
    if (!disabled) {
      openMenu(e);
    }
  }, [disabled, openMenu]);
  const handleMouseLeave = useCallback(e => {
    if (!disabled) {
      closeMenu(e);
    }
  }, [disabled, closeMenu]);
  const rootElementRef = useRef(null);
  const handleContainerBlur = useCallback(event => {
    /* istanbul ignore else */
    if (isFocusLeaving(event)) {
      closeMenu(event, false);
    }
  }, [closeMenu]);
  const rootEventHandlers = {
    onBlur: handleContainerBlur
  };
  if (openMenuOn !== null && openMenuOn !== void 0 && openMenuOn.includes('mouseover')) {
    rootEventHandlers.onMouseEnter = handleMouseEnter;
    rootEventHandlers.onMouseLeave = handleMouseLeave;
  }
  const rootProps = {
    ...rootEventHandlers,
    children: /*#__PURE__*/React.createElement(React.Fragment, null, buttonElement, /*#__PURE__*/React.createElement(MenuContext.Provider, {
      value: menu
    }, menuElement)),
    // render props
    open
  };
  if (isSubmenu) {
    rootProps.role = 'none presentation';
  }
  return children(rootProps, rootElementRef);
}
Menu.displayName = 'Menu';
export default Menu;