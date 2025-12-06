/// <reference types="react" />
interface ProgressCirclePathOptions {
    /** Circular progress bar degree */
    gapDegree: number;
    /** Circular progress bar Notch position */
    gapPosition: 'top' | 'bottom' | 'left' | 'right';
    /** Total percent of progress */
    totalPercent: number;
    /** Line color */
    strokeColor?: string;
    /** Line width */
    strokeWidth: number;
    /** Tail color */
    trailColor?: string;
}
interface ProgressCirclePathResult {
    /** SVG path string for the circle */
    pathString: string;
    /** Style object for the trail path */
    trailPathStyle: React.CSSProperties;
    /** Style object for the stroke path */
    strokePathStyle: React.CSSProperties;
}
/**
 * Custom hook to calculate path string and styles for ProgressCircle
 */
declare const useProgressCirclePath: (options: ProgressCirclePathOptions) => ProgressCirclePathResult;
export default useProgressCirclePath;
