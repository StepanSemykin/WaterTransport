import type { Locale } from 'date-fns';
interface DateInputState {
    formatStr: string;
    locale: Locale;
    date?: Date | null;
    isControlledDate?: boolean;
}
export declare function useDateInputState({ formatStr, locale, date, isControlledDate }: DateInputState): {
    dateField: import("../DateField").DateField;
    setDateOffset: (pattern: string, offset: number, callback?: ((newDate: Date | null) => void) | undefined) => void;
    setDateField: (pattern: string, value: number | null, callback?: ((newDate: Date | null) => void) | undefined) => void;
    setNewDate: (value: Date | null) => void;
    getDateField: (pattern: string) => {
        name: any;
        value: any;
    };
    toDateString: () => string;
    isEmptyValue: (type?: string | undefined, value?: number | null | undefined) => boolean | undefined;
};
export default useDateInputState;
