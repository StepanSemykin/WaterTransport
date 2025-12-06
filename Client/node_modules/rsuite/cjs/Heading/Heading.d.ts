import { BoxProps } from '../internals/Box';
export interface HeadingProps extends BoxProps {
    /**
     * Sets heading level, h1 through h6.
     * @default 3
     */
    level?: 1 | 2 | 3 | 4 | 5 | 6;
}
/**
 *
 * The `Heading` component is used to display a heading.
 *
 * @see https://rsuitejs.com/components/heading
 */
declare const Heading: import("../internals/types").InternalRefForwardingComponent<"h3", HeadingProps, never> & Record<string, never>;
export default Heading;
