import React from 'react';
import { BoxProps } from '../internals/Box';
interface ChildProps {
    onClose: () => void;
}
export interface NavbarContentProps extends Omit<BoxProps, 'children'> {
    children?: React.ReactNode | (({ onClose }: ChildProps) => React.ReactNode);
}
declare const NavbarContent: React.ForwardRefExoticComponent<NavbarContentProps & React.RefAttributes<any>>;
export default NavbarContent;
