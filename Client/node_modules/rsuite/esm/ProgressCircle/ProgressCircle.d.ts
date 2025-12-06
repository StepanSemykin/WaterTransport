import React from 'react';
import { BoxProps } from '../internals/Box';
import type { ProgressSection } from '../Progress';
export interface ProgressCircleProps extends BoxProps {
    /** Circular progress bar degree */
    gapDegree?: number;
    /** Circular progress bar Notch position */
    gapPosition?: 'top' | 'bottom' | 'left' | 'right';
    /** Percent of progress */
    percent?: number;
    /** Show text */
    showInfo?: boolean;
    /** Progress status */
    status?: 'success' | 'fail' | 'active';
    /** Line color */
    strokeColor?: string;
    /** The end of different types of open paths */
    strokeLinecap?: 'butt' | 'round' | 'square';
    /** Line width */
    strokeWidth?: number;
    /** Tail color */
    trailColor?: string;
    /** Tail width */
    trailWidth?: number;
    /** Diameter of the circle */
    width?: number;
    /** Multiple sections with different colors */
    sections?: Pick<ProgressSection, 'percent' | 'color'>[];
    /** Custom render function for info content */
    renderInfo?: (percent: number, status?: 'success' | 'fail' | 'active') => React.ReactNode;
}
/**
 * Display circular progress for an operation.
 * @see https://rsuitejs.com/components/progress-circle
 */
declare const ProgressCircle: import("../internals/types").InternalRefForwardingComponent<"div", ProgressCircleProps, never> & Record<string, never>;
export default ProgressCircle;
