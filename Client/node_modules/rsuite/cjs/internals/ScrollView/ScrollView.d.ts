import React from 'react';
import type { WithAsProps } from '../types';
export interface ScrollViewProps extends WithAsProps, React.HTMLAttributes<HTMLDivElement> {
    /**
     * The shadow of the content when scrolling
     */
    scrollShadow?: boolean;
    /**
     * Whether to customize the scrollbar
     */
    customScrollbar?: boolean;
    /**
     * The height of the scroll area
     */
    height?: number;
    /**
     * The width of the scroll area
     */
    width?: number;
    /**
     * Test ID
     * @private
     */
    'data-testid'?: string;
}
declare const ScrollView: import("../types").InternalRefForwardingComponent<"div", ScrollViewProps, never> & Record<string, never>;
export default ScrollView;
