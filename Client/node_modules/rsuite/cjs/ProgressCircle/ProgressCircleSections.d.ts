import React from 'react';
import type { ProgressSection } from '../Progress';
export interface ProgressCircleSectionsProps {
    /** The classPrefix passed from parent component */
    classPrefix: string;
    /** Multiple sections with different colors */
    sections: ProgressSection[];
    /** Path string for the circle */
    pathString: string;
    /** Stroke line cap style */
    strokeLinecap: 'butt' | 'round' | 'square';
    /** Stroke width */
    strokeWidth: number;
    /** Gap degree */
    gapDegree: number;
    /** Total percent of all sections */
    totalPercent: number;
}
/**
 * A component to render multiple sections in a circular progress bar
 */
declare const ProgressCircleSections: React.MemoExoticComponent<(props: ProgressCircleSectionsProps) => React.JSX.Element>;
export default ProgressCircleSections;
