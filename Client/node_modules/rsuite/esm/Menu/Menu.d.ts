import React from 'react';
import { BoxProps } from '../internals/Box';
import type { HTMLPropsWithoutSelect } from '../internals/types';
export interface MenuProps<T = string | number> extends BoxProps, HTMLPropsWithoutSelect<HTMLUListElement> {
    /** Set the active key for the menu */
    activeKey?: T;
    /** Callback function triggered when an item is selected */
    onSelect?: (eventKey: T | undefined, event: React.SyntheticEvent) => void;
}
/**
 * The `<Menu>` component is used to create a menu.
 *
 * @see https://rsuitejs.com/components/menu
 */
declare const Menu: import("../internals/types").InternalRefForwardingComponent<"ul", MenuProps<string | number>, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"li", import("./MenuItem").MenuItemProps<any>, never> & Record<string, never>;
    Separator: import("../internals/types").InternalRefForwardingComponent<"li", import("./MenuSeparator").MenuSeparatorProps, never> & Record<string, never>;
};
export default Menu;
