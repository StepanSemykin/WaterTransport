import { type calendarOnlyProps, type PlainDateTime, TimeProp } from './types';
import type { TimeDropdownProps } from '../../../Calendar/TimeDropdown';
interface CalendarProps {
    [TimeProp.DisabledHours]?: (hours: number, date: Date) => boolean;
    [TimeProp.DisabledMinutes]?: (minutes: number, date: Date) => boolean;
    [TimeProp.DisabledSeconds]?: (seconds: number, date: Date) => boolean;
    [TimeProp.HideHours]?: (hours: number, date: Date) => boolean;
    [TimeProp.HideMinutes]?: (minutes: number, date: Date) => boolean;
    [TimeProp.HideSeconds]?: (seconds: number, date: Date) => boolean;
}
/**
 * Verify that the time is valid.
 *
 * @param props - The calendar props.
 * @param date - The date to check.
 * @returns Whether the time is disabled.
 *
 * @deprecated Use {@link useIsDateTimeDisabled} which handles PlainDateTime instead.
 */
export declare function disableTime(props: CalendarProps, date: Date): boolean;
export default disableTime;
/**
 * Whether a datetime is allowed, based on the `hide*` and `disabled*` props.
 */
export declare function useIsDateTimeDisabled(timeDropdownProps: Pick<TimeDropdownProps, (typeof calendarOnlyProps)[number]>): (dateTime: PlainDateTime) => boolean;
