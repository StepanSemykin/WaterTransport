import React from 'react';
export interface ProgressInfoProps {
    /** The prefix of the component CSS class */
    classPrefix: string;
    /** Percent of progress */
    percent: number;
    /** Progress status */
    status?: 'success' | 'fail' | 'active';
    /** Custom render function for info content */
    renderInfo?: (percent: number, status?: 'success' | 'fail' | 'active') => React.ReactNode;
}
/**
 * Shared component for displaying progress information
 * Used by both ProgressLine and ProgressCircle
 */
declare const ProgressInfo: (props: ProgressInfoProps) => React.JSX.Element;
export default ProgressInfo;
