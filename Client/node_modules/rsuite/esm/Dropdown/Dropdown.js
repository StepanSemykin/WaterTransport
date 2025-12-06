'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext, useMemo, useReducer } from 'react';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import DropdownMenu from "./DropdownMenu.js";
import DropdownItem from "./DropdownItem.js";
import DropdownSeparator from "./DropdownSeparator.js";
import DropdownContext from "./DropdownContext.js";
import Menu from "../internals/Menu/Menu.js";
import DropdownToggle from "./DropdownToggle.js";
import NavContext from "../Nav/NavContext.js";
import Nav from "../Nav/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, kebabPlace, warnOnce } from "../internals/utils/index.js";
import { initialState, reducer } from "./DropdownState.js";
const Subcomponents = {
  Item: DropdownItem,
  Menu: DropdownMenu,
  Separator: DropdownSeparator
};
/**
 * The `Dropdown` component is used to select an option from a set of options.
 * @see https://rsuitejs.com/components/dropdown
 *
 * The `<Dropdown>` API
 * - When used inside `<Sidenav>`, renders a `<TreeviewRootItem>`;
 * - Otherwise renders a `<MenuRoot>`
 */
const Dropdown = forwardRef((props, ref) => {
  const {
    propsWithDefaults
  } = useCustom('Dropdown', props);
  const {
    as: Component = 'div',
    activeKey,
    title,
    trigger = 'click',
    placement = 'bottomStart',
    toggleAs,
    toggleClassName,
    open,
    defaultOpen,
    classPrefix = 'dropdown',
    className,
    disabled,
    children,
    menuStyle,
    style,
    onClose,
    onOpen,
    onToggle,
    onSelect,
    ...toggleProps
  } = propsWithDefaults;
  const nav = useContext(NavContext);
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
  }, dispatch] = useReducer(reducer, initialState);
  const hasSelectedItem = useMemo(() => {
    return items.some(item => item.props.selected);
  }, [items]);
  const dropdownContextValue = useMemo(() => {
    return {
      activeKey,
      onSelect,
      hasSelectedItem,
      dispatch
    };
  }, [activeKey, onSelect, hasSelectedItem, dispatch]);

  // Deprecate <Dropdown> within <Nav> usage
  // in favor of <Nav.Menu> API
  if (nav) {
    warnOnce('Usage of <Dropdown> within <Nav> is deprecated. Replace with <Nav.Menu>');
    return /*#__PURE__*/React.createElement(Nav.Menu, _extends({
      ref: ref
    }, props));
  }
  const renderMenuButton = (menuButtonProps, menuButtonRef) => /*#__PURE__*/React.createElement(DropdownToggle, _extends({
    ref: menuButtonRef,
    as: toggleAs,
    className: toggleClassName,
    placement: placement,
    disabled: disabled
  }, omit(menuButtonProps, ['open']), omit(toggleProps, ['data-testid'])), title);
  return /*#__PURE__*/React.createElement(DropdownContext.Provider, {
    value: dropdownContextValue
  }, /*#__PURE__*/React.createElement(Menu, {
    open: open,
    defaultOpen: defaultOpen,
    menuButtonText: title,
    renderMenuButton: renderMenuButton,
    disabled: disabled,
    openMenuOn: menuButtonTriggers,
    renderMenuPopup: ({
      open,
      ...popupProps
    }, popupRef) => {
      const menuClassName = mergeMenuClassName(className, withMenuClassPrefix({}));
      return /*#__PURE__*/React.createElement("ul", _extends({
        ref: popupRef,
        className: menuClassName,
        style: menuStyle,
        hidden: !open
      }, popupProps), children);
    },
    onToggleMenu: open => {
      onToggle === null || onToggle === void 0 || onToggle(open);
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
    const classes = merge(className, withPrefix());
    return /*#__PURE__*/React.createElement(Component, _extends({
      ref: mergeRefs(ref, menuContainerRef),
      className: classes,
      style: style,
      "data-placement": kebabPlace(placement),
      "data-disabled": disabled,
      "data-open": open,
      "data-active-descendant": hasSelectedItem
    }, menuContainer, pick(toggleProps, ['data-testid'])));
  }));
}, Subcomponents);
Dropdown.displayName = 'Dropdown';
export default Dropdown;