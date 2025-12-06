import React from 'react';
import { BoxProps } from '../internals/Box';
export interface CarouselProps extends BoxProps {
    /** Autoplay element */
    autoplay?: boolean;
    /** Autoplay interval */
    autoplayInterval?: number;
    /** Button placement */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Button shape */
    shape?: 'dot' | 'bar';
    /** Active element index */
    activeIndex?: number;
    /** Defaul initial index */
    defaultActiveIndex?: number;
    /** Callback fired when the active item manually changes */
    onSelect?: (index: number, event: React.ChangeEvent<HTMLInputElement>) => void;
    /** Callback fired when a slide transition starts */
    onSlideStart?: (index: number, event?: React.ChangeEvent<HTMLInputElement>) => void;
    /** Callback fired when a slide transition ends */
    onSlideEnd?: (index: number, event: React.TransitionEvent<HTMLDivElement>) => void;
}
/**
 * The Carousel component is used to display a series of content.
 * @see https://rsuitejs.com/components/carousel
 */
declare const Carousel: import("../internals/types").InternalRefForwardingComponent<"div", CarouselProps, never> & Record<string, never>;
export default Carousel;
