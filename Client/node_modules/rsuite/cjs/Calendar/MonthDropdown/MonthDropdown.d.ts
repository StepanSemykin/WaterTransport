import { WithAsProps } from '../../internals/types';
import type { PlainYearMonth } from '../../internals/utils/date/types';
export interface MonthDropdownProps extends WithAsProps {
    show?: boolean;
    limitStartYear?: number;
    limitEndYear?: number;
    height?: number;
    width?: number;
    isMonthDisabled?: (yearMonth: PlainYearMonth) => boolean;
}
declare const MonthDropdown: import("../../internals/types").InternalRefForwardingComponent<"div", MonthDropdownProps, never> & Record<string, never>;
export default MonthDropdown;
