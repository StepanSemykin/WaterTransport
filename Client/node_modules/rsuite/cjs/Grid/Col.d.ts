import { BoxProps } from '../internals/Box';
import type { ResponsiveValue } from '../internals/types';
import type { DeprecatedColProps } from './types';
export interface ColProps extends BoxProps {
    /** Grid column span for different breakpoints */
    span?: number | 'auto' | ResponsiveValue<number | 'auto'>;
    /** Grid column offset for different breakpoints */
    offset?: number | ResponsiveValue<number>;
    /** Grid column push for different breakpoints */
    push?: number | ResponsiveValue<number>;
    /** Grid column pull for different breakpoints */
    pull?: number | ResponsiveValue<number>;
    /** Grid column order for different breakpoints */
    order?: number | ResponsiveValue<number>;
    /** Grid column hidden for different breakpoints */
    hidden?: boolean | ResponsiveValue<boolean>;
}
/**
 * The `Col` component is used for layout and grids.
 * @see https://rsuitejs.com/en/components/grid
 */
declare const Col: import("../internals/types").InternalRefForwardingComponent<"div", ColProps & DeprecatedColProps, never> & Record<string, never>;
export default Col;
