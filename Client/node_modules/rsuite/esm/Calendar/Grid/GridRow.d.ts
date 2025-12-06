import { type PlainDate } from '../../internals/utils/date';
import { WithAsProps } from '../../internals/types';
/**
 * A row in the calendar month view grid, i.e. a week of days.
 */
export interface GridRowProps extends WithAsProps {
    /**
     * The starting day of the row of dates.
     */
    startingDate: PlainDate;
    /** The index of the row */
    rowIndex?: number;
}
declare const GridRow: import("../../internals/types").InternalRefForwardingComponent<"div", GridRowProps, never> & Record<string, never>;
export default GridRow;
