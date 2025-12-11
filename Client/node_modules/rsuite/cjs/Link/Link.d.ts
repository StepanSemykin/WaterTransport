import React from 'react';
import { SafeAnchorProps } from '../internals/SafeAnchor';
export interface LinkProps extends SafeAnchorProps {
    /** The icon to be displayed after the link */
    anchorIcon?: React.ReactNode;
    /** Determines in which cases link should have text-decoration: underline styles, hover by default */
    underline?: 'always' | 'hover' | 'not-hover' | 'never';
    /** Whether the link is external */
    external?: boolean;
    /** Whether to show the anchor icon */
    showAnchorIcon?: boolean;
}
declare const Link: import("../internals/types").InternalRefForwardingComponent<"a", LinkProps, never> & Record<string, never>;
export default Link;
