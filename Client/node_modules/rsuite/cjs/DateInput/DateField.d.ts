/// <reference types="react" />
import type { Locale } from 'date-fns';
export declare const patternMap: {
    y: string;
    M: string;
    d: string;
    H: string;
    h: string;
    m: string;
    s: string;
    a: string;
};
export declare class DateField extends Object {
    format: string;
    patternArray: {
        pattern: string;
        key: string;
    }[];
    year: number | null;
    month: number | null;
    day: number | null;
    hour: number | null;
    minute: number | null;
    second: number | null;
    constructor(format: string, value?: Date | null);
}
interface Action {
    type: string;
    value: any;
}
export declare const useDateField: (format: string, localize: Locale['localize'], date?: Date | null) => {
    dateField: DateField;
    dispatch: import("react").ActionDispatch<[action: Action]>;
    toDate: (type?: string, value?: number | null) => Date | null;
    toDateString: () => string;
    isEmptyValue: (type?: string, value?: number | null) => boolean | undefined;
};
export {};
