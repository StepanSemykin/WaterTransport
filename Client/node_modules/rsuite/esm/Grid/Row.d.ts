import { BoxProps } from '../internals/Box';
import type { ResponsiveValue } from '../internals/types';
import type { RowAlignment, RowJustify, GutterType } from './types';
export interface RowProps extends BoxProps {
    /** Spacing between columns. Support responsive values */
    gutter?: GutterType | ResponsiveValue<GutterType>;
    /** Vertical alignment of columns. Support responsive values */
    align?: RowAlignment | ResponsiveValue<RowAlignment>;
    /** Horizontal distribution of columns. Support responsive values */
    justify?: RowJustify | ResponsiveValue<RowJustify>;
}
/**
 * The Row component is used to create a row container that can contain Col components.
 * @see https://rsuitejs.com/components/grid
 */
declare const Row: import("../internals/types").InternalRefForwardingComponent<"div", RowProps, never> & Record<string, never>;
export default Row;
