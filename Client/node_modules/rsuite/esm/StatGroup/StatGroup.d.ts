import { BoxProps } from '../internals/Box';
export interface StatGroupProps extends BoxProps {
    /**
     * The number of columns in the group
     */
    columns?: number;
    /**
     * Spacing between columns
     */
    spacing?: number | string;
}
declare const StatGroup: import("../internals/types").InternalRefForwardingComponent<"div", StatGroupProps, never> & Record<string, never>;
export default StatGroup;
