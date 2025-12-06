import React from 'react';
export interface MenuItemProps {
    /** Active the current option */
    selected?: boolean;
    /** Disable the current option */
    disabled?: boolean;
    /** Render prop */
    children: (menuitem: React.LiHTMLAttributes<HTMLLIElement> & MenuitemRenderProps, ref: React.Ref<HTMLLIElement>) => React.ReactElement;
    /** Callback when menuitem is being activated */
    onActivate?: React.MouseEventHandler;
}
export interface MenuitemRenderProps {
    selected: boolean;
    active: boolean;
}
/**
 * Headless ARIA `menuitem`
 * @private
 */
declare function MenuItem(props: MenuItemProps): React.ReactElement<unknown, string | React.JSXElementConstructor<any>>;
declare namespace MenuItem {
    var displayName: string;
}
export default MenuItem;
