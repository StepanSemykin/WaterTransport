import React from 'react';
import { WhisperProps } from '../Whisper';
import { NavbarItemProps } from './NavbarItem';
import type { WithoutChildren } from '../internals/types';
export interface NavbarMegaMenuProps extends Omit<WithoutChildren<NavbarItemProps>, 'title'> {
    /** Define the title as a submenu */
    title?: React.ReactNode;
    /**
     * Control the open state of the mega menu
     * @default false
     */
    open?: boolean;
    /**
     * The content of the mega menu. Can be either React nodes or a render function
     * @param props.onClose Function to close the mega menu
     */
    children?: React.ReactNode | ((props: {
        onClose: () => void;
    }) => React.ReactNode);
    /**
     * Define the placement of the mega menu
     */
    placement?: WhisperProps['placement'];
}
declare const NavbarMegaMenu: React.ForwardRefExoticComponent<NavbarMegaMenuProps & React.RefAttributes<HTMLElement>>;
export default NavbarMegaMenu;
