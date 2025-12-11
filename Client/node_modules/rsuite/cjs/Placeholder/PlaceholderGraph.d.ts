import { BoxProps } from '../internals/Box';
export interface PlaceholderGraphProps extends BoxProps {
    /**
     * The height of the graph.
     *
     * @default 200
     */
    height?: number;
    /**
     * The width of the graph.
     *
     * @default 100%
     */
    width?: number;
    /**
     * Placeholder status, display the loading state.
     */
    active?: boolean;
}
/**
 * The `Placeholder.Graph` component is used to display the loading state of the block.
 * @see https://rsuitejs.com/components/placeholder
 */
declare const PlaceholderGraph: import("../internals/types").InternalRefForwardingComponent<"div", PlaceholderGraphProps, never> & Record<string, never>;
export default PlaceholderGraph;
