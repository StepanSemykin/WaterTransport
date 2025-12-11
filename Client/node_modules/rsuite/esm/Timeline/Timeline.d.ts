import React from 'react';
import { BoxProps } from '../internals/Box';
export interface TimelineProps extends BoxProps {
    /** The content of the component */
    children?: React.ReactNode;
    /** TimeLine content relative position  **/
    align?: 'left' | 'right' | 'alternate';
    /** Timeline endless **/
    endless?: boolean;
    /**
     * Whether an item is active (with highlighted dot).
     *
     * @default
     * The last item is marked active.
     */
    isItemActive?: (index: number, totalItemsCount: number) => boolean;
}
/**
 * The `Timeline` component is used to display a list of items in chronological order.
 *
 * @see https://rsuitejs.com/components/timeline
 */
declare const Timeline: import("../internals/types").InternalRefForwardingComponent<"div", TimelineProps, never> & {
    Item: import("../internals/types").InternalRefForwardingComponent<"div", import("./TimelineItem").TimelineItemProps, never> & Record<string, never>;
    ACTIVE_FIRST: (index: number) => boolean;
    ACTIVE_LAST: (index: number, totalItemsCount: number) => boolean;
};
export default Timeline;
