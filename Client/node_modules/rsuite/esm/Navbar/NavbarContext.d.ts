import React from 'react';
interface NavbarContextValue {
    appearance: 'default' | 'inverse' | 'subtle';
    open: boolean;
    navbarId: string;
    onToggle?: (open: boolean) => void;
}
export declare const NavbarContext: React.Context<NavbarContextValue | null>;
export {};
