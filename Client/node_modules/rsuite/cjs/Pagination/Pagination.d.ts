import React from 'react';
import { BoxProps } from '../internals/Box';
import type { BasicSize } from '../internals/types';
import type { PaginationLocale } from '../locales';
export interface PaginationProps extends BoxProps {
    /** Current page number */
    activePage?: number;
    /** Page buttons display the maximum number of */
    maxButtons?: number;
    /** Displays the first page */
    first?: boolean | React.ReactNode;
    /** Displays the last page */
    last?: boolean | React.ReactNode;
    /** Displays the prev page */
    prev?: boolean | React.ReactNode;
    /** Displays the next page */
    next?: boolean | React.ReactNode;
    /** Total pages */
    pages?: number;
    /** Disabled component */
    disabled?: boolean | ((eventKey: number | string) => boolean);
    /** Show border paging buttons 1 and pages */
    boundaryLinks?: boolean;
    /** Displays the ellipsis */
    ellipsis?: boolean | React.ReactNode;
    /** Customizes the element type for the component */
    linkAs?: React.ElementType;
    /** Additional props passed as-is to the underlying link for non-active items */
    linkProps?: Record<string, any>;
    /** Custom locale */
    locale?: PaginationLocale;
    /** A pagination can have different sizes */
    size?: BasicSize;
    /** callback function for pagination clicked */
    onSelect?: (eventKey: string | number, event: React.MouseEvent) => void;
}
/**
 * Pagination component for displaying page numbers.
 *
 * @see https://rsuitejs.com/components/pagination
 */
declare const Pagination: import("../internals/types").InternalRefForwardingComponent<"div", PaginationProps, never> & Record<string, never>;
export default Pagination;
