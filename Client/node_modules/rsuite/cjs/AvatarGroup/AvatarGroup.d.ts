import React from 'react';
import { BoxProps } from '../internals/Box';
import type { Size } from '../internals/types';
export interface AvatarGroupProps extends BoxProps {
    /**
     * Render all avatars as stacks
     */
    stack?: boolean;
    /**
     * Set the spacing of the avatar
     */
    spacing?: number;
    /**
     * Set the size of all avatars.
     */
    size?: Size;
}
export declare const AvatarGroupContext: React.Context<{
    size?: "xs" | "sm" | "md" | "lg" | "xl" | undefined;
    spacing?: number | undefined;
}>;
/**
 * The AvatarGroup component is used to represent a collection of avatars.
 * @see https://rsuitejs.com/components/avatar
 */
declare const AvatarGroup: import("../internals/types").InternalRefForwardingComponent<"div", AvatarGroupProps, never> & Record<string, never>;
export default AvatarGroup;
