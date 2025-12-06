import React from 'react';
import { BurgerProps } from '../internals/Burger';
export interface NavbarToggleProps extends Omit<BurgerProps, 'onToggle'> {
    /**
     * Callback function that is called when the toggle is clicked.
     */
    onToggle?: (open: boolean) => void;
}
declare const NavbarToggle: React.ForwardRefExoticComponent<NavbarToggleProps & React.RefAttributes<any>>;
export default NavbarToggle;
