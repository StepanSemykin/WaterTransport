import { BoxProps } from '../internals/Box';
import type { Offset } from '../internals/types';
export interface AffixProps extends BoxProps {
    /** Specify the container. */
    container?: HTMLElement | (() => HTMLElement);
    /** Distance from top */
    top?: number;
    /** Callback after the state changes. */
    onChange?: (fixed?: boolean) => void;
    /** Callback after the offset changes. */
    onOffsetChange?: (offset?: Offset) => void;
}
/**
 * Components such as navigation, buttons, etc. can be fixed in the visible range.
 * Commonly used for pages with long content, fixed the specified elements in the visible range of the page to assist in quick operation.
 *
 * @see https://rsuitejs.com/components/affix/
 */
declare const Affix: import("../internals/types").InternalRefForwardingComponent<"div", AffixProps, never> & Record<string, never>;
export default Affix;
