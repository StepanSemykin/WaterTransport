import type { WithAsProps } from '../internals/types';
import type { PlainYearMonth } from '../internals/utils/date/types';
export type CalendarBodyProps = WithAsProps & {
    yearMonth: PlainYearMonth;
};
/**
 * The calendar month view, i.e. grid of dates.
 */
declare const CalendarBody: import("../internals/types").InternalRefForwardingComponent<"div", CalendarBodyProps, never> & Record<string, never>;
export default CalendarBody;
