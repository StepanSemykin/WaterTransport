import { BoxProps } from '../internals/Box';
export interface PlaceholderGridProps extends BoxProps {
    /**
     * The number of rows.
     *
     * @default 5
     */
    rows?: number;
    /**
     * The height of the row.
     *
     * @default 10
     */
    rowHeight?: number;
    /**
     * @deprecated Use `rowSpacing` instead.
     */
    rowMargin?: number;
    /**
     * The spacing between rows.
     *
     * @default 20
     * @version 5.59.1
     */
    rowSpacing?: number;
    /**
     * The number of columns.
     * @default 5
     */
    columns?: number;
    /**
     * Placeholder status, display the loading state.
     */
    active?: boolean;
}
/**
 * The `Placeholder.Grid` component is used to display the loading state of the block.
 * @see https://rsuitejs.com/components/placeholder
 */
declare const PlaceholderGrid: import("../internals/types").InternalRefForwardingComponent<"div", PlaceholderGridProps, never> & Record<string, never>;
export default PlaceholderGrid;
