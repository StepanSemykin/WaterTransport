import React from 'react';
export interface ProgressStrokeProps extends React.HTMLAttributes<HTMLDivElement> {
    /** The classPrefix passed from parent component */
    classPrefix: string;
    /** Percent of progress */
    percent: number;
    /** Line color */
    color?: string;
    /** Whether the progress bar is displayed vertically */
    vertical?: boolean;
    /** Children to be rendered inside the stroke */
    children?: React.ReactNode;
    /** Whether this is part of a multi-section progress bar */
    isSection?: boolean;
    /** Tooltip of this section */
    tooltip?: React.ReactNode;
    /**  The percentage of the current section in the total progress bar */
    countPercent?: number;
}
/**
 * A single stroke component used within ProgressLine
 */
declare const ProgressStroke: React.MemoExoticComponent<(props: ProgressStrokeProps) => React.JSX.Element>;
export default ProgressStroke;
