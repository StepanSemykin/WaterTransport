import React from 'react';
import { PredefinedRangesProps } from './PredefinedRanges';
export interface ToolbarProps<T = any, Shortcut = T> extends PredefinedRangesProps<T, Shortcut> {
    hideOkBtn?: boolean;
    disableOkBtn?: (value: T) => boolean;
    onOk?: (event: React.MouseEvent) => void;
}
type ToolbarComponent = React.ForwardRefExoticComponent<ToolbarProps> & {
    <T = any, Shortcut = T>(props: ToolbarProps<T, Shortcut>): any;
};
/**
 * Toolbar for DatePicker and DateRangePicker
 */
declare const Toolbar: ToolbarComponent;
export default Toolbar;
