import React from 'react';
import { BoxProps } from '../internals/Box';
export interface HighlightProps extends BoxProps {
    query?: string | string[];
    renderMark?: (match: string, index: number) => React.ReactNode;
}
/**
 *
 * Highlight the matching text in the content.
 *
 * @see https://rsuitejs.com/components/highlight
 */
declare const Highlight: import("../internals/types").InternalRefForwardingComponent<"div", HighlightProps, never> & Record<string, never>;
export default Highlight;
