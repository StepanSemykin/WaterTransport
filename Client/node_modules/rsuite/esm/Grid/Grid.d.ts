import { BoxProps } from '../internals/Box';
export interface GridProps extends BoxProps {
    /** Whether the grid container should have a fluid width */
    fluid?: boolean;
}
/**
 * The Grid component is used to specify the layout of child elements in rows and columns.
 * @see https://rsuitejs.com/components/grid
 */
declare const Grid: import("../internals/types").InternalRefForwardingComponent<"div", GridProps, never> & Record<string, never>;
export default Grid;
