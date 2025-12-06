import React from 'react';
import type { WithAsProps, PlacementCorners } from '../internals/types';
export interface SidenavDropdownToggleProps extends WithAsProps {
    noCaret?: boolean;
    renderToggle?: (props: WithAsProps, ref: React.Ref<any>) => any;
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
declare const SidenavDropdownToggle: import("../internals/types").InternalRefForwardingComponent<import("../internals/types").InternalRefForwardingComponent<"button", import("../Button").ButtonProps, never> & Record<string, never>, SidenavDropdownToggleProps, never> & Record<string, never>;
export default SidenavDropdownToggle;
