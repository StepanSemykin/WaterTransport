import React from 'react';
import { BaseBoxProps } from '../internals/Box';
export interface MenuSeparatorProps extends BaseBoxProps, React.HTMLAttributes<HTMLElement> {
    /** You can use a custom element for this component */
    as?: React.ElementType;
}
/**
 * The `<Menu.Separator>` API
 *
 */
declare const MenuSeparator: import("../internals/types").InternalRefForwardingComponent<"li", MenuSeparatorProps, never> & Record<string, never>;
export default MenuSeparator;
