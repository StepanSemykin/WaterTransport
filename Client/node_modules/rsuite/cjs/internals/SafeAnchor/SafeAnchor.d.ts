import React from 'react';
import { BaseBoxProps } from '../Box';
export interface SafeAnchorProps extends BaseBoxProps, React.HTMLAttributes<HTMLElement> {
    /** Link specified url */
    href?: string;
    /** A link can show it is currently unable to be interacted with */
    disabled?: boolean;
}
/**
 * A SafeAnchor is a wrapper around the `<a>` HTML element.
 * @private
 */
declare const SafeAnchor: import("../types").InternalRefForwardingComponent<"a", SafeAnchorProps, never> & Record<string, never>;
export default SafeAnchor;
