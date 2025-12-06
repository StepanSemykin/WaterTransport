'use client';
import { useCallback, useContext, useEffect, useRef } from 'react';
import isNil from 'lodash/isNil';
import MenuContext, { MenuActionTypes, MoveFocusTo } from "./MenuContext.js";
import { useUniqueId } from "../hooks/index.js";
/**
 * Headless ARIA `menuitem`
 * @private
 */
function MenuItem(props) {
  var _menuState$items$menu;
  const {
    children,
    selected = false,
    disabled = false,
    onActivate
  } = props;
  const menuitemRef = useRef(null);
  const menuitemId = useUniqueId('menuitem-');
  const menu = useContext(MenuContext);
  if (!menu) {
    throw new Error('<Menu.Item> must be rendered within a <Menu>, and <Menu> does not support nested <Menu>');
  }
  const [menuState, dispatch] = menu;

  // Whether this menuitem has focus (indicated by `aria-activedescendant` from parent menu)
  const hasFocus = !isNil(menuitemRef.current) && !isNil(menuState.activeItemIndex) && ((_menuState$items$menu = menuState.items[menuState.activeItemIndex]) === null || _menuState$items$menu === void 0 ? void 0 : _menuState$items$menu.element) === menuitemRef.current;
  const handleClick = useCallback(event => {
    if (disabled) {
      return;
    }
    onActivate === null || onActivate === void 0 || onActivate(event);
  }, [disabled, onActivate]);

  // Gain/release focus on mousedown in `menubar`

  const handleMouseDown = useCallback(() => {
    if (!isNil(menuitemRef.current) && !hasFocus) {
      dispatch({
        type: MenuActionTypes.MoveFocus,
        to: MoveFocusTo.Specific,
        id: menuitemRef.current.id
      });
    }
  }, [dispatch, hasFocus]);

  // Gain/release focus on mouseenter/mouseleave in `menu`
  const handleMouseMove = useCallback(() => {
    if (!isNil(menuitemRef.current) && !hasFocus) {
      dispatch({
        type: MenuActionTypes.MoveFocus,
        to: MoveFocusTo.Specific,
        id: menuitemRef.current.id
      });
    }
  }, [hasFocus, dispatch]);
  const handleMouseLeave = useCallback(() => {
    dispatch({
      type: MenuActionTypes.MoveFocus,
      to: MoveFocusTo.None
    });
  }, [dispatch]);
  useEffect(() => {
    const menuitemElement = menuitemRef.current;
    if (menuitemElement) {
      dispatch({
        type: MenuActionTypes.RegisterItem,
        element: menuitemElement,
        props: {
          disabled
        }
      });
      return () => {
        dispatch({
          type: MenuActionTypes.UnregisterItem,
          id: menuitemElement.id
        });
      };
    }
  }, [menuitemRef, disabled, dispatch]);
  const menuitemProps = {
    id: menuitemId,
    role: 'menuitem',
    // fixme Only use `aria-checked` on menuitemradio and menuitemcheckbox
    'aria-checked': selected || undefined,
    'aria-disabled': disabled || undefined,
    tabIndex: -1,
    onClick: handleClick,
    // render props

    selected,
    active: hasFocus
  };

  // Only move focus on hover in a `menu`, not `menubar`
  if ((menuState === null || menuState === void 0 ? void 0 : menuState.role) === 'menu') {
    menuitemProps.onMouseMove = handleMouseMove;
    menuitemProps.onMouseLeave = handleMouseLeave;
  }
  if ((menuState === null || menuState === void 0 ? void 0 : menuState.role) === 'menubar') {
    menuitemProps.onMouseDown = handleMouseDown;
    menuitemProps.onMouseOver = handleMouseMove;
    menuitemProps.onMouseLeave = handleMouseLeave;
  }
  return children(menuitemProps, menuitemRef);
}
MenuItem.displayName = 'MenuItem';
export default MenuItem;