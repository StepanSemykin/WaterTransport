'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useMemo, useReducer } from 'react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import Menu from "../internals/Menu/Menu.js";
import NavContext from "./NavContext.js";
import NavDropdownItem from "./NavDropdownItem.js";
import NavDropdownMenu from "./NavDropdownMenu.js";
import NavDropdownToggle from "./NavDropdownToggle.js";
import Box from "../internals/Box/index.js";
import { useStyles } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, kebabPlace } from "../internals/utils/index.js";
import { initialState, reducer } from "../Dropdown/DropdownState.js";
const Subcomponents = {
  Item: NavDropdownItem,
  Menu: NavDropdownMenu
};

/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a `<Nav.Menu>` call
 *
 * @example
 * <Nav>
 *   <Nav.Menu> -> This will render <NavDropdown> component
 *   </Nav.Menu>
 * </Nav>
 */
const NavDropdown = forwardRef((props, ref) => {
  const nav = useContext(NavContext);
  if (!nav) {
    throw new Error('<Nav.Dropdown> must be rendered within a <Nav> component.');
  }
  const {
    as,
    title,
    onClose,
    onOpen,
    onToggle,
    eventKey,
    trigger = 'click',
    placement = 'bottomStart',
    toggleAs,
    toggleClassName,
    classPrefix = 'dropdown',
    className,
    disabled,
    children,
    menuStyle,
    style,
    ...toggleProps
  } = props;
  const {
    merge,
    withPrefix
  } = useStyles(classPrefix);
  const {
    withPrefix: withMenuClassPrefix,
    merge: mergeMenuClassName
  } = useStyles('dropdown-menu');
  const menuButtonTriggers = useMemo(() => {
    if (!trigger) {
      return undefined;
    }
    const triggerMap = {
      hover: 'mouseover',
      click: 'click',
      contextMenu: 'contextmenu'
    };
    if (!Array.isArray(trigger)) {
      return [triggerMap[trigger]];
    }
    return trigger.map(t => triggerMap[t]);
  }, [trigger]);
  const [{
    items
  }] = useReducer(reducer, initialState);
  const hasSelectedItem = useMemo(() => {
    return items.some(item => item.props.selected);
  }, [items]);
  const renderMenuButton = (menuButtonProps, menuButtonRef) => /*#__PURE__*/React.createElement(NavDropdownToggle, _extends({
    ref: menuButtonRef,
    as: toggleAs,
    className: toggleClassName,
    placement: placement,
    disabled: disabled
  }, omit(menuButtonProps, ['open']), omit(toggleProps, ['data-testid'])), title);
  return /*#__PURE__*/React.createElement(Menu, {
    renderMenuButton: renderMenuButton,
    openMenuOn: menuButtonTriggers,
    renderMenuPopup: ({
      open,
      ...popupProps
    }, popupRef) => {
      const menuClassName = mergeMenuClassName(className, withMenuClassPrefix());
      return /*#__PURE__*/React.createElement("ul", _extends({
        ref: popupRef,
        className: menuClassName,
        style: menuStyle,
        hidden: !open
      }, popupProps), children);
    },
    onToggleMenu: (open, event) => {
      onToggle === null || onToggle === void 0 || onToggle(open, eventKey, event);
      if (open) {
        onOpen === null || onOpen === void 0 || onOpen();
      } else {
        onClose === null || onClose === void 0 || onClose();
      }
    }
  }, ({
    open,
    ...menuContainer
  }, menuContainerRef) => {
    const classes = merge(className, withPrefix({
      disabled,
      open
    }));
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: as,
      ref: mergeRefs(ref, menuContainerRef),
      className: classes,
      style: style,
      "data-placement": kebabPlace(placement),
      "data-active-descendant": hasSelectedItem
    }, menuContainer, pick(toggleProps, ['data-testid'])));
  });
}, Subcomponents);
NavDropdown.displayName = 'Nav.Dropdown';
export default NavDropdown;