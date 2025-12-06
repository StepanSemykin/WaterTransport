'use client';
import _extends from "@babel/runtime/helpers/esm/extends";
import React, { useContext } from 'react';
import omit from 'lodash/omit';
import isNil from 'lodash/isNil';
import PagePreviousIcon from '@rsuite/icons/PagePrevious';
import PageNextIcon from '@rsuite/icons/PageNext';
import Disclosure from "../internals/Disclosure/index.js";
import NavContext from "../Nav/NavContext.js";
import { mergeRefs } from "../internals/utils/index.js";
import { useStyles, useCustom } from "../internals/hooks/index.js";
import { NavbarContext } from "./NavbarContext.js";
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Menu> within a <Navbar>
 *
 * <Navbar>
 *   <Nav>
 *     <Nav.Menu>
 *       <Nav.Menu title="menu"> -> This submenu will render <NavbarDropdownMenu> component
 *       </Nav.Menu>
 *     </Nav.Menu>
 *   </Nav>
 * </Navbar>
 */
const NavbarDropdownMenu = /*#__PURE__*/React.forwardRef((props, ref) => {
  const navbar = useContext(NavbarContext);
  const nav = useContext(NavContext);
  if (!navbar || !nav) {
    throw new Error('<Navbar.Dropdown.Menu> must be rendered within a <Nav> within a <Navbar> component.');
  }
  const {
    onToggle,
    eventKey,
    title,
    classPrefix = 'dropdown-menu',
    children,
    openDirection = 'end',
    ...rest
  } = props;
  const {
    rtl
  } = useCustom();
  const {
    prefix
  } = useStyles(classPrefix);
  const {
    withPrefix: withMenuClassPrefix,
    merge: mergeMenuClassName
  } = useStyles('dropdown-menu');
  const {
    merge: mergeItemClassNames,
    withPrefix: withItemClassPrefix,
    prefix: prefixItemClassName
  } = useStyles('dropdown-item');

  // Parent menu exists. This is a submenu.
  // Should render a `menuitem` that controls this submenu.
  const {
    icon,
    className,
    disabled,
    ...menuProps
  } = omit(rest, ['trigger']);
  const Icon = rtl ? PagePreviousIcon : PageNextIcon;
  return /*#__PURE__*/React.createElement(Disclosure, {
    hideOnClickOutside: true,
    trigger: ['click', 'hover'],
    onToggle: (open, event) => onToggle === null || onToggle === void 0 ? void 0 : onToggle(open, undefined, event)
  }, ({
    open,
    ...props
  }, containerRef) => {
    const classes = mergeItemClassNames(className, withItemClassPrefix('submenu'));
    return /*#__PURE__*/React.createElement("li", _extends({
      ref: mergeRefs(ref, containerRef),
      className: classes,
      "data-open": open,
      "data-disabled": disabled
    }, props), /*#__PURE__*/React.createElement(Disclosure.Button, null, ({
      open,
      ...buttonProps
    }, buttonRef) => {
      const classes = mergeItemClassNames(className, prefixItemClassName`toggle`, withItemClassPrefix());
      const dataAttributes = {
        'data-open': open,
        'data-disabled': disabled,
        'data-with-icon': !!icon,
        'data-event-key': eventKey
      };
      if (!isNil(eventKey) && typeof eventKey !== 'string') {
        dataAttributes['data-event-key-type'] = typeof eventKey;
      }
      return /*#__PURE__*/React.createElement("div", _extends({
        ref: mergeRefs(buttonRef, buttonRef),
        className: classes
      }, dataAttributes, buttonProps), icon && /*#__PURE__*/React.cloneElement(icon, {
        className: prefix('menu-icon')
      }), title, /*#__PURE__*/React.createElement(Icon, {
        className: prefix`toggle-icon`
      }));
    }), /*#__PURE__*/React.createElement(Disclosure.Content, null, ({
      open
    }, elementRef) => {
      const menuClassName = mergeMenuClassName(className, withMenuClassPrefix());
      return /*#__PURE__*/React.createElement("ul", _extends({
        ref: elementRef,
        className: menuClassName,
        hidden: !open,
        "data-direction": openDirection
      }, menuProps), children);
    }));
  });
});
NavbarDropdownMenu.displayName = 'Nav.Dropdown.Menu';
export default NavbarDropdownMenu;