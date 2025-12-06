import React from 'react';
import { BoxProps } from '../internals/Box';
export interface SidenavDropdownCollapseProps extends BoxProps {
    open?: boolean;
}
declare const SidenavDropdownCollapse: React.ForwardRefExoticComponent<SidenavDropdownCollapseProps & React.HTMLAttributes<HTMLUListElement> & React.RefAttributes<unknown>>;
export default SidenavDropdownCollapse;
