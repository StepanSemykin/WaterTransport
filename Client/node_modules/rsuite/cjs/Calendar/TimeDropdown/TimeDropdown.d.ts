import { WithAsProps } from '../../internals/types';
import type { PlainDate } from '../../internals/utils/date/types';
export interface TimeDropdownProps extends WithAsProps {
    show?: boolean;
    showMeridiem?: boolean;
    disabledHours?: (hour: number, date: PlainDate) => boolean;
    disabledMinutes?: (minute: number, date: PlainDate) => boolean;
    disabledSeconds?: (second: number, date: PlainDate) => boolean;
    hideHours?: (hour: number, date: PlainDate) => boolean;
    hideMinutes?: (minute: number, date: PlainDate) => boolean;
    hideSeconds?: (second: number, date: PlainDate) => boolean;
}
declare const TimeDropdown: import("../../internals/types").InternalRefForwardingComponent<"div", TimeDropdownProps, never> & Record<string, never>;
export default TimeDropdown;
