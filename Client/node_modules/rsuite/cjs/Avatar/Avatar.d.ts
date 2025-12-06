import React, { CSSProperties } from 'react';
import { StyledBoxProps } from '../internals/StyledBox';
import type { BoxProps } from '../internals/Box';
import type { ColorScheme } from '../internals/types';
export interface AvatarProps extends BoxProps {
    /**
     * A avatar can have different sizes.
     */
    size?: StyledBoxProps['size'];
    /**
     * The `src` attribute for the `img` element.
     */
    src?: string;
    /**
     * The `sizes` attribute for the `img` element.
     */
    sizes?: string;
    /**
     * The `srcSet` attribute for the `img` element.
     * Use this attribute for responsive image display.
     */
    srcSet?: string;
    /**
     * Attributes applied to the `img` element if the component is used to display an image.
     * It can be used to listen for the loading error event.
     */
    imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
    /**
     * Set avatar shape to circle
     */
    circle?: boolean;
    /**
     * This attribute defines an alternative text description of the image
     */
    alt?: string;
    /**
     * Show a border around the avatar.
     * @version 5.59.0
     */
    bordered?: boolean;
    /**
     * Sets the avatar background color.
     * @version 5.59.0
     */
    color?: ColorScheme | CSSProperties['color'];
    /**
     * Callback fired when the image failed to load.
     * @version 5.59.0
     */
    onError?: OnErrorEventHandler;
}
/**
 * The Avatar component is used to represent user or brand.
 * @see https://rsuitejs.com/components/avatar
 */
declare const Avatar: import("../internals/types").InternalRefForwardingComponent<"div", AvatarProps, never> & Record<string, never>;
export default Avatar;
