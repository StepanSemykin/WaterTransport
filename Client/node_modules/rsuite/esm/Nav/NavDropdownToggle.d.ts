import React from 'react';
import { NavItemProps } from './NavItem';
import { BoxProps } from '../internals/Box';
import type { PlacementCorners } from '../internals/types';
export interface NavDropdownToggleProps extends BoxProps {
    icon?: NavItemProps['icon'];
    noCaret?: boolean;
    renderToggle?: (props: BoxProps, ref: React.Ref<any>) => any;
    placement?: PlacementCorners;
}
/**
 * @private this component is not supposed to be used directly
 *          Instead it's rendered by a <Nav.Menu> call
 *
 * <Nav>
 *   <Nav.Menu> -> This will render <NavDropdown> component that renders a <NavDropdownToggle>
 *   </Nav.Menu>
 * </Nav>
 */
declare const NavDropdownToggle: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", import("../Button").ButtonProps, never> & Record<string, never>, NavDropdownToggleProps, never> & Record<string, never>;
export default NavDropdownToggle;
