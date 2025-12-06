import type { WithAsProps } from '../../internals/types';
import type { PlainYearMonth } from '../../internals/utils/date/types';
export interface MonthDropdownItemProps extends WithAsProps {
    yearMonth: PlainYearMonth;
    active?: boolean;
    disabled?: boolean;
}
declare const MonthDropdownItem: import("../../internals/types").InternalRefForwardingComponent<"div", MonthDropdownItemProps, never> & Record<string, never>;
export default MonthDropdownItem;
