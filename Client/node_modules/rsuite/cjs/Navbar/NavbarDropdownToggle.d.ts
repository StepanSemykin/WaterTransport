import React from 'react';
import { BoxProps } from '../internals/Box';
import type { PlacementCorners } from '../internals/types';
export interface NavbarDropdownToggleProps extends BoxProps {
    noCaret?: boolean;
    placement?: PlacementCorners;
    renderToggle?: (props: BoxProps, ref: React.Ref<any>) => any;
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
declare const NavbarDropdownToggle: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", import("../Button").ButtonProps, never> & Record<string, never>, NavbarDropdownToggleProps, never> & Record<string, never>;
export default NavbarDropdownToggle;
