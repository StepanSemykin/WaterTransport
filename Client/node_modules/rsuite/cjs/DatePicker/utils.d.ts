/// <reference types="lodash" />
import { ToolbarProps } from './Toolbar';
import type { DateOptionPreset } from '../internals/types';
import type { InnerRange } from './types';
import type { DateRange } from '../DateRangePicker/types';
export declare function getDefaultRanges<T extends Date | DateRange>(value: T): InnerRange<T>[];
/**
 * get Toolbar ranges from Toolbar props
 * @param ranges
 * @param calendarDate
 */
export declare const getRanges: <T extends Date | DateRange>({ ranges, calendarDate }: Pick<ToolbarProps<T, T>, "calendarDate" | "ranges">) => InnerRange<T | null>[];
export declare function splitRanges<T extends Date | DateRange>(ranges?: DateOptionPreset<T | null>[]): {
    sideRanges: DateOptionPreset<T | null>[] | undefined;
    bottomRanges: DateOptionPreset<T | null>[] | undefined;
};
export declare const getRestProps: (props: any, omitProps?: string[]) => import("lodash").Omit<any, string>;
