import React from 'react';
export interface MenuContextProps {
    activeKey?: string | number;
    onSelect?: (eventKey: string | undefined, event: React.SyntheticEvent) => void;
}
declare const MenuContext: React.Context<MenuContextProps | null>;
export default MenuContext;
