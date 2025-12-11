import React from 'react';
import { BoxProps } from '../internals/Box';
import type { ProgressSection } from './types';
export interface ProgressLineProps extends BoxProps {
    /** Whether to show indeterminate loading animation */
    indeterminate?: boolean;
    /** Percent of progress */
    percent?: number;
    /** The placement of the percent info */
    percentPlacement?: 'start' | 'end' | 'insideStart' | 'insideEnd' | 'insideCenter';
    /** Line color */
    strokeColor?: string;
    /** Line width */
    strokeWidth?: number;
    /** Show text */
    showInfo?: boolean;
    /** Progress status */
    status?: 'success' | 'fail' | 'active';
    /** Whether to apply a striped effect to the progress bar */
    striped?: boolean;
    /** Multiple sections with different colors */
    sections?: ProgressSection[];
    /** Trail color */
    trailColor?: string;
    /** Trail width */
    trailWidth?: number;
    /**  The progress bar is displayed vertically */
    vertical?: boolean;
    /** The radius of the progress bar */
    radius?: number | string;
    /** Custom render function for info content */
    renderInfo?: (percent: number, status?: 'success' | 'fail' | 'active') => React.ReactNode;
}
/**
 * The `Progress.Line` component is used to display the progress of current operation.
 * @see https://rsuitejs.com/components/progress/#line
 */
declare const ProgressLine: import("../internals/types").InternalRefForwardingComponent<"div", ProgressLineProps, never> & Record<string, never>;
export default ProgressLine;
