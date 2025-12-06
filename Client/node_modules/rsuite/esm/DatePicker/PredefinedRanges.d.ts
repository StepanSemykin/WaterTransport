import React from 'react';
import { StackProps } from '../Stack';
import type { InnerRange } from './types';
import type { CalendarLocale } from '../locales';
import type { DateOptionPreset } from '../internals/types';
export interface PredefinedRangesProps<T = any, Shortcut = T> extends StackProps {
    ranges?: DateOptionPreset<Shortcut | null>[];
    calendarDate: T;
    locale?: CalendarLocale;
    disableShortcut?: (value: T) => boolean;
    onShortcutClick?: (range: InnerRange<Shortcut>, closeOverlay: boolean, event: React.MouseEvent) => void;
}
declare const PredefinedRanges: React.ForwardRefExoticComponent<PredefinedRangesProps<any, any> & React.RefAttributes<HTMLDivElement>>;
export default PredefinedRanges;
