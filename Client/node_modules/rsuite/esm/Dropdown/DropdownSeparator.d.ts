import React from 'react';
import type { WithAsProps } from '../internals/types';
export interface DropdownSeparatorProps extends WithAsProps, React.HTMLAttributes<HTMLElement> {
    /** You can use a custom element for this component */
    as?: React.ElementType;
}
/**
 * The `<Dropdown.Separator>` API
 *
 * Renders a non-focusable and non-interactive `separator`
 * Per ARIA APG https://www.w3.org/WAI/ARIA/apg/patterns/menu/
 */
declare const DropdownSeparator: import("../internals/types").InternalRefForwardingComponent<"li", DropdownSeparatorProps, never> & Record<string, never>;
export default DropdownSeparator;
