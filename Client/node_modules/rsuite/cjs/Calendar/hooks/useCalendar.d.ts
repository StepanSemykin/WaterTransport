/// <reference types="react" />
export declare const useCalendar: () => {
    formatDate?: typeof import("date-fns").format | undefined;
    date?: Date | undefined;
    dateRange?: Date[] | undefined;
    format?: string | undefined;
    hoverRangeValue?: [Date, Date] | undefined;
    inline?: boolean | undefined;
    targetId?: string | undefined;
    monthDropdownProps?: import("../types").MonthDropdownProps | undefined;
    disabledDate?: ((date: import("../../internals/utils/date").PlainDate, selectRangeValue?: (import("../../internals/utils/date").PlainDate | undefined)[] | undefined, type?: string | undefined) => boolean) | undefined;
    onChangeMonth?: ((month: import("../../internals/utils/date/types").PlainYearMonth, event: import("react").MouseEvent<Element, MouseEvent>) => void) | undefined;
    onChangeTime?: ((time: import("../../internals/utils/date/types").PlainTime, event: import("react").MouseEvent<Element, MouseEvent>) => void) | undefined;
    onMouseMove?: ((date: import("../../internals/utils/date").PlainDate) => void) | undefined;
    onSelect?: ((date: import("../../internals/utils/date").PlainDate, event: import("react").MouseEvent<Element, MouseEvent>) => void) | undefined;
    renderCell?: ((date: import("../../internals/utils/date").PlainDate) => import("react").ReactNode) | undefined;
    renderCellOnPicker?: ((date: import("../../internals/utils/date").PlainDate) => import("react").ReactNode) | undefined;
    cellClassName?: ((date: import("../../internals/utils/date").PlainDate) => string | undefined) | undefined;
    locale: import("../../locales").CalendarLocale | undefined;
    showWeekNumbers: boolean | undefined;
    isoWeek: boolean;
    weekStart: import("date-fns").Day;
};
