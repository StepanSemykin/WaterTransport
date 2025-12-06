'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useCallback, useContext, useEffect } from 'react';
import classNames from 'classnames';
import MenuItem from "../internals/Menu/MenuItem.js";
import DropdownContext from "./DropdownContext.js";
import isNil from 'lodash/isNil';
import pick from 'lodash/pick';
import Nav from "../Nav/index.js";
import NavContext from "../Nav/NavContext.js";
import Text from "../Text/index.js";
import DropdownSeparator from "./DropdownSeparator.js";
import { useRenderMenuItem } from "../internals/Menu/useRenderMenuItem.js";
import { useStyles, useInternalId } from "../internals/hooks/index.js";
import { forwardRef, mergeRefs, shallowEqual, warnOnce } from "../internals/utils/index.js";
import { DropdownActionType } from "./DropdownState.js";
/**
 * The `<Dropdown.Item>` API
 * - When used inside `<Sidenav>`, renders a `<TreeviewItem>`
 * - Otherwise renders a `<MenuItem>`
 */
const DropdownItem = forwardRef((props, ref) => {
  const {
    as = 'li',
    active: activeProp,
    classPrefix = 'dropdown-item',
    className,
    children,
    shortcut,
    disabled,
    description,
    divider,
    eventKey,
    icon,
    panel,
    onSelect,
    ...restProps
  } = props;
  const internalId = useInternalId('DropdownItem');
  const nav = useContext(NavContext);
  const dropdown = useContext(DropdownContext);
  const {
    merge,
    withPrefix,
    prefix
  } = useStyles(classPrefix);
  const handleSelectItem = useCallback(event => {
    var _dropdown$onSelect;
    onSelect === null || onSelect === void 0 || onSelect(eventKey, event);
    dropdown === null || dropdown === void 0 || (_dropdown$onSelect = dropdown.onSelect) === null || _dropdown$onSelect === void 0 || _dropdown$onSelect.call(dropdown, eventKey, event);
  }, [onSelect, eventKey, dropdown]);
  const selected = activeProp || !isNil(eventKey) && shallowEqual(dropdown === null || dropdown === void 0 ? void 0 : dropdown.activeKey, eventKey);
  const dispatch = dropdown === null || dropdown === void 0 ? void 0 : dropdown.dispatch;
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: DropdownActionType.RegisterItem,
        payload: {
          id: internalId,
          props: {
            selected
          }
        }
      });
      return () => {
        dispatch({
          type: DropdownActionType.UnregisterItem,
          payload: {
            id: internalId
          }
        });
      };
    }
  }, [internalId, selected, dispatch]);
  const renderDropdownItem = useRenderMenuItem(as);

  // If using <Dropdown.Item> within <Nav>
  // Suggest <Nav.Item>
  if (nav) {
    warnOnce('Usage of <Dropdown.Item> within <Nav> is deprecated. Replace with <Nav.Item> within <Nav.Menu>.');
    return /*#__PURE__*/React.createElement(Nav.Item, _extends({
      ref: ref
    }, props));
  }
  if (divider) {
    return /*#__PURE__*/React.createElement(DropdownSeparator, _extends({
      as: "li"
    }, pick(props, ['data-testid'])));
  }
  if (panel) {
    return renderDropdownItem({
      ref,
      className: merge(prefix('panel'), className),
      children,
      ...restProps
    });
  }
  return /*#__PURE__*/React.createElement(MenuItem, {
    selected: selected,
    disabled: disabled,
    onActivate: handleSelectItem
  }, ({
    selected,
    active,
    ...menuitem
  }, menuitemRef) => {
    const classes = merge(className, withPrefix({
      divider,
      panel
    }));
    const dataAttributes = {
      'data-disabled': disabled,
      'data-focus': active,
      'data-active': selected,
      'data-with-icon': !!icon,
      'data-event-key': eventKey
    };
    if (!isNil(eventKey) && typeof eventKey !== 'string') {
      dataAttributes['data-event-key-type'] = typeof eventKey;
    }
    return renderDropdownItem({
      ref: mergeRefs(ref, menuitemRef),
      className: classes,
      ...menuitem,
      ...dataAttributes,
      ...restProps,
      children: /*#__PURE__*/React.createElement(React.Fragment, null, icon && /*#__PURE__*/React.cloneElement(icon, {
        className: classNames(prefix('menu-icon'), icon.props.className)
      }), /*#__PURE__*/React.createElement("div", {
        className: prefix('content')
      }, /*#__PURE__*/React.createElement(Text, {
        as: "span"
      }, children), /*#__PURE__*/React.createElement(Text, {
        as: "span",
        muted: true
      }, description)), shortcut && /*#__PURE__*/React.createElement(Text, {
        as: "kbd",
        className: prefix('shortcut'),
        muted: true
      }, shortcut))
    });
  });
});
DropdownItem.displayName = 'Dropdown.Item';
export default DropdownItem;