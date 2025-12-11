import React, { CSSProperties } from 'react';
import { BoxProps } from '../internals/Box';
export interface ImageProps extends Omit<BoxProps, 'rounded' | 'color' | 'height' | 'width' | 'position'>, Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'placeholder'> {
    /**
     * An image may appear with border.
     */
    bordered?: boolean;
    /**
     * An image may appear circular.
     */
    circle?: boolean;
    /**
     * The fallback image when the src fails to load.
     */
    fallbackSrc?: string;
    /**
     * An image may appear rounded.
     */
    rounded?: boolean;
    /**
     * Whether there is a shadow.
     */
    shaded?: boolean;
    /**
     * It maps to css `object-fit` property.
     */
    fit?: CSSProperties['objectFit'];
    /**
     * It maps to css `object-position` property.
     */
    position?: CSSProperties['objectPosition'];
    /**
     * The placeholder to display when the image is loading.
     */
    placeholder?: React.ReactNode;
    /**
     * Whether the image should be zoomed when hovered.
     */
    zoomed?: boolean;
}
declare const Image: import("../internals/types").InternalRefForwardingComponent<"img", ImageProps, never> & Record<string, never>;
export default Image;
