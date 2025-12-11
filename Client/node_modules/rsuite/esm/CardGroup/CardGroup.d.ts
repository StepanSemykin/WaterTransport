import { BoxProps } from '../internals/Box';
export interface CardGroupProps extends BoxProps {
    /**
     * The number of columns in the group
     */
    columns?: number;
    /**
     * Spacing between columns
     */
    spacing?: number | string;
}
declare const CardGroup: import("../internals/types").InternalRefForwardingComponent<"div", CardGroupProps, never> & Record<string, never>;
export default CardGroup;
