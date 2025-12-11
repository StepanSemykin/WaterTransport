import { BoxProps } from '../internals/Box';
export interface CardProps extends BoxProps {
    /**
     * Show border
     */
    bordered?: boolean;
    /**
     * Whether there is a shadow
     */
    shaded?: boolean | 'hover';
    /**
     * The width of the card
     */
    width?: number | string;
    /**
     * The direction of the card
     */
    direction?: 'row' | 'column';
    /**
     * Different sizes
     */
    size?: 'lg' | 'md' | 'sm';
}
declare const Card: import("../internals/types").InternalRefForwardingComponent<"div", CardProps, never> & {
    Header: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Body: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
    Footer: import("../internals/types").InternalRefForwardingComponent<"div", Partial<import("../internals/utils").ComponentProps>, never> & Record<string, never>;
};
export default Card;
